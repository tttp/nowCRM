// src/services/baseService.ts

import type { Session } from "next-auth";
import qs from "qs";
import { env } from "@/lib/config/envConfig";
import type StrapiQuery from "../../types/common/StrapiQuery";
import type { StandardResponse } from "./response.service";
import { handleError, handleResponse } from "./response.service";

/**
 * Generic base service to handle common CRUD operations.
 * @template T - The type of the data entity.
 * @template FormT - The type of the form data used for creating/updating.
 */
class BaseService<T, FormT> {
	protected constructor(protected endpoint: string) {}

	/**
	 * Generates headers for HTTP requests.
	 * @param {boolean} contentType - Whether to include the Content-Type header.
	 * @param {string} [token] - Optional JWT token for authorization.
	 * @returns {Headers} - The headers object.
	 */
	protected getHeaders(contentType = false, token?: string): Headers {
		if (!token) {
			throw new Error("Authorization token is required.");
		}

		const headers = new Headers({
			Authorization: `Bearer ${token}`,
		});

		if (contentType) {
			headers.append("Content-Type", "application/json");
		}

		return headers;
	}

	/**
	 * Fetches a list of entities based on provided query options.
	 * @param {StrapiQuery} [options] - Query parameters for filtering, sorting, pagination, etc.
	 * @param {boolean} [isPublic] - when you need public action which will use env api token
	 * @returns {Promise<StandardResponse<T[]>>} - The standard response containing an array of entities.
	 */
	async find(
		options?: StrapiQuery<T>,
		isPublic?: boolean,
	): Promise<StandardResponse<T[]>> {
		const query = qs.stringify(options, { encodeValuesOnly: true });
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}?${query}`;
		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}
		try {
			const response = await fetch(url, {
				headers: this.getHeaders(
					false,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
				cache: "no-store",
			});
			return await handleResponse<T[]>(response);
		} catch (error: any) {
			return handleError<T[]>(error);
		}
	}

	/**
	 * Fetches and returns all entities across all pages using Strapi pagination.
	 * Uses options.pagination.pageSize if provided, otherwise defaults to 100.
	 * Does not mutate the provided options object.
	 */
	async findAll(
		options?: StrapiQuery<T>,
		isPublic?: boolean,
	): Promise<StandardResponse<T[]>> {
		// Defensive clone so we never mutate caller options
		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}

		const baseOptions: StrapiQuery<T> = options
			? JSON.parse(JSON.stringify(options))
			: ({} as any);

		// Ensure we have a pagination object with page and pageSize
		const pageSize =
			(baseOptions as any)?.pagination?.pageSize &&
			Number((baseOptions as any).pagination.pageSize) > 0
				? Number((baseOptions as any).pagination.pageSize)
				: 100;

		let page = 1;
		let pageCount: number | undefined;
		let total: number | undefined;

		const allData: T[] = [];
		let lastStatus = 200;

		try {
			for (;;) {
				const query = qs.stringify(
					{
						...baseOptions,
						pagination: {
							...(baseOptions as any)?.pagination,
							page,
							pageSize,
						},
					},
					{ encodeValuesOnly: true },
				);

				const url = new URL(
					`${this.endpoint}?${query}`,
					env.CRM_STRAPI_API_URL,
				);
				const resp = await fetch(url, {
					headers: this.getHeaders(
						false,
						session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
					),
					cache: "no-store",
				});

				const handled = await handleResponse<T[]>(resp);
				lastStatus = handled.status;

				// If a page fails, bubble up the error
				if (!handled.success) {
					return handled;
				}

				// Accumulate data
				if (Array.isArray(handled.data)) {
					allData.push(...handled.data);
				}

				const meta = handled.meta as
					| {
							pagination?: {
								page?: number;
								pageSize?: number;
								pageCount?: number;
								total?: number;
							};
					  }
					| undefined;

				// If no pagination metadata is available, stop based on data length
				if (!meta?.pagination) {
					if (!handled.data || handled.data.length < pageSize) {
						break;
					}
					// Fallback safeguard to avoid infinite loop
					if (page > 10_000) {
						break;
					}
					page += 1;
					continue;
				}

				if (page === 1) {
					pageCount = Number(meta.pagination.pageCount ?? NaN);
					total = Number(meta.pagination.total ?? NaN);
				}

				// Stop if we reached the last page or if current page returned fewer than pageSize items
				const reachedLastByCount =
					typeof pageCount === "number" && page >= pageCount;
				const reachedLastByData =
					!handled.data || handled.data.length < pageSize;

				if (reachedLastByCount || reachedLastByData) {
					break;
				}

				page += 1;
			}

			const finalMeta: any = {
				pagination: {
					page: 1,
					pageSize,
					pageCount:
						pageCount ??
						(allData.length > 0 ? Math.ceil(allData.length / pageSize) : 1),
					total: total ?? allData.length,
				},
			};

			return {
				data: allData,
				status: lastStatus,
				success: true,
				meta: finalMeta,
			};
		} catch (error: any) {
			return handleError<T[]>(error);
		}
	}

	/**
	 * Fetches a single entity by its ID with populated relations.
	 * @param {number} id - The unique identifier of the entity.
	 * @param {StrapiQuery} [options] - Query parameters for filtering, sorting, pagination, etc.
	 * @returns {Promise<StandardResponse<T>>} - The standard response containing the entity details.
	 */
	async findOne(
		id: number,
		options?: StrapiQuery<T>,
		isPublic?: boolean,
	): Promise<StandardResponse<T>> {
		const query = qs.stringify(options, { encodeValuesOnly: true });
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}/${id}?${query}`;
		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}

		try {
			const response = await fetch(url, {
				headers: this.getHeaders(
					false,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
				cache: "no-store",
			});
			return await handleResponse<T>(response);
		} catch (error: any) {
			return handleError<T>(error);
		}
	}

	/**
	 * Deletes an entity by its ID.
	 * @param {number} id - The unique identifier of the entity to delete.
	 * @returns {Promise<StandardResponse<null>>} - The standard response indicating success or failure.
	 */
	async delete(
		id: number,
		isPublic?: boolean,
	): Promise<StandardResponse<null>> {
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}/${id}`;

		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}
		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: this.getHeaders(
					false,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
			});
			if (response.ok) {
				return {
					data: null,
					status: response.status,
					success: true,
				};
			}
			const errorData = await response.json();
			return {
				data: null,
				status: response.status,
				success: false,
				errorMessage:
					`${errorData.error.message} Status -${errorData.error.status}` ||
					`Failed to delete. Status - ${errorData.status}`,
			};
		} catch (error: any) {
			return handleError<null>(error);
		}
	}

	/**
	 * Creates a new entity.
	 * @param {FormT} form - The form data to create the entity.
	 * @returns {Promise<StandardResponse<T>>} - The standard response containing the created entity.
	 */
	async create(form: FormT, isPublic?: boolean): Promise<StandardResponse<T>> {
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}`;

		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(
					true,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
				body: JSON.stringify({ data: form }),
			});
			console.log(response);
			return await handleResponse<T>(response);
		} catch (error: any) {
			return handleError<T>(error);
		}
	}

	/**
	 * Updates an existing entity by its ID.
	 * @param {number} id - The unique identifier of the entity to update.
	 * @param {Partial<FormT>} form - The updated form data.
	 * @returns {Promise<StandardResponse<T>>} - The standard response containing the updated entity.
	 */
	async update(
		id: number,
		form: Partial<FormT>,
		isPublic?: boolean,
		falseData?: boolean,
	): Promise<StandardResponse<T>> {
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}/${id}`;

		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: this.getHeaders(
					true,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
				body: falseData ? JSON.stringify(form) : JSON.stringify({ data: form }),
			});

			return await handleResponse<T>(response);
		} catch (error: any) {
			return handleError<T>(error);
		}
	}

	/**
	 * Unpublish (soft delete) an entity by its ID.
	 * @param {number} id - The unique identifier of the entity to unpublish.
	 * @returns {Promise<StandardResponse<null>>} - The standard response indicating success or failure.
	 */
	async unPublish(
		id: number,
		isPublic?: boolean,
	): Promise<StandardResponse<null>> {
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}/${id}`;

		let session: Session | null = null;
		if (!isPublic) {
			const { auth } = await import("@/auth");
			session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}
		}

		const postData = {
			data: {
				publishedAt: null,
			},
		};
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: this.getHeaders(
					true,
					session ? session.jwt : env.CRM_STRAPI_API_TOKEN,
				),
				body: JSON.stringify(postData),
			});
			if (response.ok) {
				return {
					data: null,
					status: response.status,
					success: true,
				};
			}
			const errorData = await response.json();
			return {
				data: null,
				status: response.status,
				success: false,
				errorMessage:
					`${errorData.error.message} Status -${errorData.error.status}` ||
					`Failed to unpublish. Status - ${errorData.status}`,
			};
		} catch (error: any) {
			return handleError<null>(error);
		}
	}
	/**
	 * Returns the type of the item.
	 * @returns {string} - The type of the item.
	 */
	getItemType(): string {
		return typeof ({} as T);
	}
}

export default BaseService;

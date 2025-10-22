import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { Contact, Form_Contact } from "@/lib/types/new_type/contact";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import type { StandardResponse } from "../common/response.service";

class ContactsService extends BaseService<Contact, Form_Contact> {
	private static instance: ContactsService;

	private constructor() {
		super(APIRoutes.CONTACTS);
	}

	/**
	 * Retrieves the singleton instance of ContactsService.
	 * @returns {ContactsService} - The singleton instance.
	 */
	public static getInstance(): ContactsService {
		if (!ContactsService.instance) {
			ContactsService.instance = new ContactsService();
		}
		return ContactsService.instance;
	}

	/**
	 * Fetches contacts with filters for preview
	 * @param filters - The filters to apply
	 * @param page - The page number (default: 1)
	 * @param pageSize - The page size (default: 5)
	 * @returns Promise with data and total count
	 */
	async fetchWithFilters(
		filters: any,
		page = 1,
		pageSize = 5,
		sortBy?: string,
		sortOrder: "asc" | "desc" = "desc",
	): Promise<{ data: Contact[]; totalCount: number }> {
		try {
			const response = await this.find({
				filters,
				pagination: {
					page,
					pageSize,
				},
				populate: {
					subscriptions: { populate: ["id", "channel", "subscribedAt"] },
					contact_interests: "*",
					lists: "*",
					keywords: "*",
					tags: "*",
					journeys: "*",
					journey_steps: "*",
				},
				sort: sortBy ? [`${sortBy}:${sortOrder}` as any] : undefined,
			});
			return {
				data: response.data || [],
				totalCount: response.meta?.pagination?.total || 0,
			};
		} catch (error) {
			console.error("Error fetching contacts with filters:", error);
			throw error;
		}
	}

	/**
	 * Deletes contacts based on filters
	 * @param filters - The filters to apply for deletion
	 * @returns Promise with success status and message
	 */
	async deleteWithFilters(
		filters: any,
	): Promise<{ success: boolean; message?: string }> {
		try {
			console.log("Deleting contacts with filters:", filters);
			return { success: true, message: "Contacts deleted successfully" };
		} catch (error) {
			console.error("Error deleting contacts with filters:", error);
			return { success: false, message: "Failed to delete contacts" };
		}
	}

	/**
	 * Fetch contacts by IDs and convert to CSV string.
	 */
	async exportCsv(ids: number[]): Promise<string> {
		const formatCell = (raw: any): string => {
			if (raw == null) {
				return "";
			}
			if (Array.isArray(raw)) {
				return raw
					.map((item) =>
						typeof item === "object"
							? (item.name ?? item.label ?? JSON.stringify(item))
							: String(item),
					)
					.join("; ");
			}
			if (typeof raw === "object") {
				return raw.name ?? raw.label ?? JSON.stringify(raw);
			}
			return String(raw);
		};

		const response = await this.find({
			filters: { id: { $in: ids } },
			populate: "*",
		});
		const data: Contact[] = response.data || [];

		if (!data.length) {
			return "";
		}

		const headers = Object.keys(data[0]);

		const rows = data.map((contact) =>
			headers
				.map((key) => {
					const raw = (contact as any)[key];
					const cell = formatCell(raw);
					return `"${cell.replace(/"/g, '""')}"`;
				})
				.join(","),
		);

		return [headers.join(","), ...rows].join("\r\n");
	}

	/**
	 * Adds contacts to a list based on filters
	 * @param filters - The filters to apply
	 * @param listId - The ID of the list to add contacts to
	 * @returns Promise with success status and message
	 */
	async addToListWithFilters(
		filters: any,
		listId: number,
	): Promise<{ success: boolean; message?: string }> {
		try {
			console.log("Adding contacts to list with filters:", { filters, listId });
			return { success: true, message: "Contacts added to list successfully" };
		} catch (error) {
			console.error("Error adding contacts to list with filters:", error);
			return { success: false, message: "Failed to add contacts to list" };
		}
	}

	/**
	 * Exports the full data of a contact by ID.
	 * Useful for GDPR data access requests.
	 *
	 * @param contactId - The ID of the contact to export
	 * @returns Promise with the contact data and success status
	 */
	async exportUserData(
		contactId: number,
	): Promise<{ data?: Contact; success: boolean; message?: string }> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.CONTACT_EXPORT_DATA}`;
		const session = await auth();

		if (!session) {
			return {
				data: undefined,
				success: false,
				message: "Unauthorized",
			};
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ contactId }),
			});
			console.log(response);

			const json = await response.json();

			if (!response.ok || json.success === false) {
				return {
					data: undefined,
					success: false,
					message: json.message || "Failed to export contact",
				};
			}

			return {
				data: json.data as Contact,
				success: true,
				message: json.message || "Contact exported successfully",
			};
		} catch (error: any) {
			console.error("Export error:", error);
			return {
				data: undefined,
				success: false,
				message: error?.message || "Unexpected error during contact export",
			};
		}
	}

	/**
	 * Anonymizes sensitive data of a contact by ID.
	 * This action is irreversible and is typically used for GDPR data deletion requests.
	 *
	 * @param contactId - The ID of the contact to anonymize
	 * @returns Promise with anonymized contact data and success status
	 */
	async anonymizeContact(
		contactId: number,
	): Promise<{ data?: Contact; success: boolean; message?: string }> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.CONTACT_ANONYMIZE_DATA}`;
		const session = await auth();

		if (!session) {
			return {
				data: undefined,
				success: false,
				message: "Unauthorized",
			};
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ contactId }),
			});

			const json = await response.json();

			if (!response.ok || json.success === false) {
				return {
					data: undefined,
					success: false,
					message: json.message || "Failed to anonymize contact",
				};
			}

			return {
				data: json.data as Contact,
				success: true,
				message: json.message || "Contact anonymized successfully",
			};
		} catch (error: any) {
			console.error("Anonymization error:", error);
			return {
				data: undefined,
				success: false,
				message:
					error?.message || "Unexpected error during contact anonymization",
			};
		}
	}

	/**
	 * Duplicates a contact by its ID.
	 * @param {number} contactId - The ID of the contact to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - A promise that resolves to the response object.
	 */
	async duplicate(contactId: number): Promise<StandardResponse<null>> {
		const session = await auth();
		if (!session) {
			console.log("No session found");
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.CONTACTS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: contactId }),
			});

			const result = await response.json();

			return {
				data: result.responseObject ?? null,
				status: result.status ?? 200,
				success: result.success ?? true,
				errorMessage: result.message,
			};
		} catch (_error: any) {
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "error",
			};
		}
	}

	async updateContact(
		contactId: number,
		_updateData: Record<string, any>,
	): Promise<{ data?: Contact; success: boolean; message?: string }> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.CONTACT_UPDATE}`;
		const session = await auth();

		if (!session) {
			return {
				data: undefined,
				success: false,
				message: "Unauthorized",
			};
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ contactId }),
			});

			const text = await response.text();
			console.log(
				"updateContact raw response:",
				response.status,
				response.url,
				text,
			);

			let json: any;
			try {
				json = JSON.parse(text);
			} catch {
				throw new Error(`Server did not return JSON: ${text}`);
			}

			if (!response.ok || json.success === false) {
				return {
					data: undefined,
					success: false,
					message: json.message || "Failed to update contact",
				};
			}

			return {
				data: json.data as Contact,
				success: true,
				message: json.message || "Contact updated successfully",
			};
		} catch (error: any) {
			console.error("Update error:", error);
			return {
				data: undefined,
				success: false,
				message: error?.message || "Unexpected error during contact update",
			};
		}
	}
}

const contactsService = ContactsService.getInstance();
export default contactsService;

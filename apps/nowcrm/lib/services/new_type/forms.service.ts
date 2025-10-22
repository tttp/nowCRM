import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { Form_FormEntity, FormEntity } from "@/lib/types/new_type/form";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import {
	handleError,
	handleResponse,
	type StandardResponse,
} from "../common/response.service";
import type Asset from "./assets/asset";

class FormsService extends BaseService<FormEntity, Form_FormEntity> {
	private static instance: FormsService;

	private constructor() {
		super(APIRoutes.FORMS);
	}

	/**
	 * Retrieves the singleton instance of FormsService.
	 * @returns {FormsService} - The singleton instance.
	 */
	public static getInstance(): FormsService {
		if (!FormsService.instance) {
			FormsService.instance = new FormsService();
		}
		return FormsService.instance;
	}

	public async submit(payload: {
		formId?: number;
		identifier: string;
		formData: Record<string, any>; // might include File[]
	}): Promise<{ success: boolean; message?: string }> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.FORM_SUBMIT}`;

		const formData = new FormData();
		formData.append("formId", String(payload.formId));
		formData.append("identifier", payload.identifier);

		for (const [key, value] of Object.entries(payload.formData)) {
			if (Array.isArray(value) && value[0] instanceof File) {
				for (const file of value) {
					formData.append(`files.${key}`, file); // file upload
					formData.append(`formData[${key}]`, file.name); // file name
				}
			} else {
				formData.append(`formData[${key}]`, value);
			}
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				// ❌ No Content-Type header — browser sets it
				headers: {
					Authorization: `Bearer ${env.CRM_STRAPI_API_TOKEN}`,
				},
				body: formData,
			});

			return await handleResponse<{ success: boolean; message?: string }>(
				response,
			);
		} catch (error) {
			console.error("Error submitting form:", error);
			return handleError<{ success: boolean; message?: string }>(error);
		}
	}

	async uploadCoverOrLogo(
		files: any,
		formId: number,
		targetField: string,
	): Promise<StandardResponse<Asset[]>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.UPLOAD}`;
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
		formData.append("ref", "api::form.form");
		formData.append("refId", formId.toString());
		formData.append("field", targetField);
		try {
			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "POST",
				body: formData,
			});
			return await handleResponse(response);
		} catch (error: any) {
			return handleError(error);
		}
	}

	async deleteCoverOrLogo(assetId: number): Promise<StandardResponse<Asset[]>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.UPLOAD}/files/${assetId}`;
		const session = await auth();

		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "DELETE",
			});
			return await handleResponse(response);
		} catch (error: any) {
			return handleError(error);
		}
	}

	/**
	 * Duplicates a form by its ID.
	 * @param {number} formId - The ID of the form to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - A promise that resolves to the response object.
	 */
	async duplicate(formId: number): Promise<StandardResponse<null>> {
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
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.FORMS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: formId }),
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
}

const formsService = FormsService.getInstance();
export default formsService;

// src/services/contact.service.ts

import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type {
	Form_Organization,
	Organization,
} from "@/lib/types/new_type/organization";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import type { StandardResponse } from "../common/response.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class OrganizationService extends BaseService<Organization, Form_Organization> {
	private static instance: OrganizationService;

	private constructor() {
		super(APIRoutes.ORGANIZATIONS);
	}

	/**
	 * Retrieves the singleton instance of OrganizationService.
	 * @returns {OrganizationService} - The singleton instance.
	 */
	public static getInstance(): OrganizationService {
		if (!OrganizationService.instance) {
			OrganizationService.instance = new OrganizationService();
		}
		return OrganizationService.instance;
	}
	/**
	 * Duplicates an organization by its ID.
	 * @param {number} organizationId - The ID of the organization to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - The response from the API.
	 */
	async duplicate(organizationId: number): Promise<StandardResponse<null>> {
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
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.ORGANIZATIONS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: organizationId }),
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

const organizationService = OrganizationService.getInstance();
export default organizationService;

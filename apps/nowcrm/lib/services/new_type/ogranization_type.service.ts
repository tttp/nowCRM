// src/services/contact.service.ts

import type {
	Form_OrganizationType,
	OrganizationType,
} from "@/lib/types/new_type/organization_type";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class OrganizationTypeService extends BaseService<
	OrganizationType,
	Form_OrganizationType
> {
	private static instance: OrganizationTypeService;

	private constructor() {
		super(APIRoutes.ORGANIZATION_TYPES);
	}

	/**
	 * Retrieves the singleton instance of OrganizationTypeService.
	 * @returns {OrganizationTypeService} - The singleton instance.
	 */
	public static getInstance(): OrganizationTypeService {
		if (!OrganizationTypeService.instance) {
			OrganizationTypeService.instance = new OrganizationTypeService();
		}
		return OrganizationTypeService.instance;
	}
}

const organizationTypeService = OrganizationTypeService.getInstance();
export default organizationTypeService;

// src/services/contact.service.ts

import type { Form_Identity, Identity } from "@/lib/types/new_type/identity";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class IdentityService extends BaseService<Identity, Form_Identity> {
	private static instance: IdentityService;

	private constructor() {
		super(APIRoutes.IDENTITY);
	}

	/**
	 * Retrieves the singleton instance of IdentityService.
	 * @returns {IdentityService} - The singleton instance.
	 */
	public static getInstance(): IdentityService {
		if (!IdentityService.instance) {
			IdentityService.instance = new IdentityService();
		}
		return IdentityService.instance;
	}
}

const identityService = IdentityService.getInstance();
export default identityService;

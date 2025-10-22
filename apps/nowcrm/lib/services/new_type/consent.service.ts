// src/services/consent.service.ts

import type { Consent, Form_Consent } from "@/lib/types/new_type/consent";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Consent-related API interactions.
 * Extends the generic BaseService with Consent-specific types.
 */
class ConsentService extends BaseService<Consent, Form_Consent> {
	private static instance: ConsentService;

	private constructor() {
		super(APIRoutes.CONSENTS);
	}

	/**
	 * Retrieves the singleton instance of ConsentService.
	 * @returns {ConsentService} - The singleton instance.
	 */
	public static getInstance(): ConsentService {
		if (!ConsentService.instance) {
			ConsentService.instance = new ConsentService();
		}
		return ConsentService.instance;
	}
}

const consentService = ConsentService.getInstance();
export default consentService;

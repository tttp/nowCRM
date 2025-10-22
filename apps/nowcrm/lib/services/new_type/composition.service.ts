// src/services/consent.service.ts

import type { Consent, Form_Consent } from "@/lib/types/new_type/consent";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Consent-related API interactions.
 * Extends the generic BaseService with Consent-specific types.
 */
class CompositionService extends BaseService<Consent, Form_Consent> {
	private static instance: CompositionService;

	private constructor() {
		super(APIRoutes.COMPOSITIONS);
	}

	/**
	 * Retrieves the singleton instance of ConsentService.
	 * @returns {ConsentService} - The singleton instance.
	 */
	public static getInstance(): CompositionService {
		if (!CompositionService.instance) {
			CompositionService.instance = new CompositionService();
		}
		return CompositionService.instance;
	}
}

const compositionService = CompositionService.getInstance();
export default compositionService;

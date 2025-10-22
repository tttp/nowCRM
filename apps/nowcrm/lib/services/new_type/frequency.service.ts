// src/services/contact.service.ts

import type { Form_Frequency, Frequency } from "@/lib/types/new_type/frequency";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class FrequencyService extends BaseService<Frequency, Form_Frequency> {
	private static instance: FrequencyService;

	private constructor() {
		super(APIRoutes.FREQUENCIES);
	}

	/**
	 * Retrieves the singleton instance of FrequencyService.
	 * @returns {FrequencyService} - The singleton instance.
	 */
	public static getInstance(): FrequencyService {
		if (!FrequencyService.instance) {
			FrequencyService.instance = new FrequencyService();
		}
		return FrequencyService.instance;
	}
}

const frequencyService = FrequencyService.getInstance();
export default frequencyService;

// src/services/ScheduledComposition.service

import type {
	Form_ScheduledComposition,
	ScheduledComposition,
} from "@/lib/types/new_type/sceduled_composition";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Consent-related API interactions.
 * Extends the generic BaseService with Consent-specific types.
 */
class ScheduledCompositionService extends BaseService<
	ScheduledComposition,
	Form_ScheduledComposition
> {
	private static instance: ScheduledCompositionService;

	private constructor() {
		super(APIRoutes.SCHEDULED_COMPOSITIONS);
	}

	/**
	 * Retrieves the singleton instance of ConsentService.
	 * @returns {ScheduledCompositionService} - The singleton instance.
	 */
	public static getInstance(): ScheduledCompositionService {
		if (!ScheduledCompositionService.instance) {
			ScheduledCompositionService.instance = new ScheduledCompositionService();
		}
		return ScheduledCompositionService.instance;
	}
}

const scheduledCompositionService = ScheduledCompositionService.getInstance();
export default scheduledCompositionService;

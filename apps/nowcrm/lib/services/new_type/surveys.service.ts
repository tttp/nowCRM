import type { Form_Survey, Survey } from "@/lib/types/new_type/survey";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class SurveysService extends BaseService<Survey, Form_Survey> {
	private static instance: SurveysService;

	private constructor() {
		super(APIRoutes.SURVEYS);
	}

	/**
	 * Retrieves the singleton instance of SurveysService.
	 * @returns {SurveysService} - The singleton instance.
	 */
	public static getInstance(): SurveysService {
		if (!SurveysService.instance) {
			SurveysService.instance = new SurveysService();
		}
		return SurveysService.instance;
	}
}

const surveysService = SurveysService.getInstance();
export default surveysService;

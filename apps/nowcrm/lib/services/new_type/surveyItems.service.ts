// contactsapp/lib/services/new_type/surveyItems.service.ts
import type {
	Form_SurveyItem,
	SurveyItem,
} from "@/lib/types/new_type/survey_item";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class SurveyItemsService extends BaseService<SurveyItem, Form_SurveyItem> {
	private static instance: SurveyItemsService;

	private constructor() {
		super(APIRoutes.SURVEY_ITEMS);
	}

	/**
	 * Retrieves the singleton instance of SurveysService.
	 * @returns {SurveysService} - The singleton instance.
	 */
	public static getInstance(): SurveyItemsService {
		if (!SurveyItemsService.instance) {
			SurveyItemsService.instance = new SurveyItemsService();
		}
		return SurveyItemsService.instance;
	}
}

const surveyItemsService = SurveyItemsService.getInstance();
export default surveyItemsService;

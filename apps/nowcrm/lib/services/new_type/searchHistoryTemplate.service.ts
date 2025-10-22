import APIRoutes from "../../http/apiRoutes";
import type {
	Form_SearchHistoryTemplate,
	SearchHistoryTemplate,
} from "../../types/new_type/searchHistoryTemplate";
import BaseService from "../common/base.service";

class SearchHistoryTemplateService extends BaseService<
	SearchHistoryTemplate,
	Form_SearchHistoryTemplate
> {
	private static instance: SearchHistoryTemplateService;

	private constructor() {
		super(APIRoutes.SEARCH_HISTORY_TEMPLATES);
	}

	/**
	 * Retrieves the singleton instance of SearchHistoryTemplateService.
	 * @returns {SearchHistoryTemplateService} - The singleton instance.
	 */
	public static getInstance(): SearchHistoryTemplateService {
		if (!SearchHistoryTemplateService.instance) {
			SearchHistoryTemplateService.instance =
				new SearchHistoryTemplateService();
		}
		return SearchHistoryTemplateService.instance;
	}
}

const searchHistoryTemplateService = SearchHistoryTemplateService.getInstance();
export default searchHistoryTemplateService;

import APIRoutes from "../../http/apiRoutes";
import type {
	Form_SearchHistory,
	SearchHistory,
} from "../../types/new_type/searchHistory";
import BaseService from "../common/base.service";

class SearchHistoryService extends BaseService<
	SearchHistory,
	Form_SearchHistory
> {
	private static instance: SearchHistoryService;

	private constructor() {
		super(APIRoutes.SEARCH_HISTORY);
	}

	/**
	 * Retrieves the singleton instance of SearchHistoryService.
	 * @returns {SearchHistoryService} - The singleton instance.
	 */
	public static getInstance(): SearchHistoryService {
		if (!SearchHistoryService.instance) {
			SearchHistoryService.instance = new SearchHistoryService();
		}
		return SearchHistoryService.instance;
	}
}

const searchHistoryService = SearchHistoryService.getInstance();
export default searchHistoryService;

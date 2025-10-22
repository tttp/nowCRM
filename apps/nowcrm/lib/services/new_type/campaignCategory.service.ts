import APIRoutes from "../../http/apiRoutes";
import type {
	CampaignCategory,
	Form_CampaignCategory,
} from "../../types/new_type/campaignCategory";
import BaseService from "../common/base.service";

class CampaignCategoryService extends BaseService<
	CampaignCategory,
	Form_CampaignCategory
> {
	private static instance: CampaignCategoryService;

	private constructor() {
		super(APIRoutes.CAMPAIGN_CATEGORY);
	}

	/**
	 * Retrieves the singleton instance of CampaignCategoryService.
	 * @returns {CampaignCategoryService} - The singleton instance.
	 */
	public static getInstance(): CampaignCategoryService {
		if (!CampaignCategoryService.instance) {
			CampaignCategoryService.instance = new CampaignCategoryService();
		}
		return CampaignCategoryService.instance;
	}
}

const campaignCategoryService = CampaignCategoryService.getInstance();
export default campaignCategoryService;

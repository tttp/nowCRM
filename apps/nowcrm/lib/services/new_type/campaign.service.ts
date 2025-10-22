import APIRoutes from "../../http/apiRoutes";
import type { Campaign, Form_Campaign } from "../../types/new_type/campaign";
import BaseService from "../common/base.service";

class CampaignService extends BaseService<Campaign, Form_Campaign> {
	private static instance: CampaignService;

	private constructor() {
		super(APIRoutes.CAMPAIGN);
	}

	/**
	 * Retrieves the singleton instance of CampaignService.
	 * @returns {CampaignService} - The singleton instance.
	 */
	public static getInstance(): CampaignService {
		if (!CampaignService.instance) {
			CampaignService.instance = new CampaignService();
		}
		return CampaignService.instance;
	}
}

const campaignService = CampaignService.getInstance();
export default campaignService;

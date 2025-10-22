import type { Form_Rank, Rank } from "@/lib/types/new_type/rank";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class RankService extends BaseService<Rank, Form_Rank> {
	private static instance: RankService;

	private constructor() {
		super(APIRoutes.RANKS);
	}

	/**
	 * Retrieves the singleton instance of RankService.
	 * @returns {RankService} - The singleton instance.
	 */
	public static getInstance(): RankService {
		if (!RankService.instance) {
			RankService.instance = new RankService();
		}
		return RankService.instance;
	}
}

const rankService = RankService.getInstance();
export default rankService;

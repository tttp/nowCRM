import APIRoutes from "../../http/apiRoutes";
import type { Form_Industry, Industry } from "../../types/new_type/industry";
import BaseService from "../common/base.service";

class IndustryService extends BaseService<Industry, Form_Industry> {
	private static instance: IndustryService;

	private constructor() {
		super(APIRoutes.INDUSTRY);
	}

	/**
	 * Retrieves the singleton instance of IndustryService.
	 * @returns {IndustryService} - The singleton instance.
	 */
	public static getInstance(): IndustryService {
		if (!IndustryService.instance) {
			IndustryService.instance = new IndustryService();
		}
		return IndustryService.instance;
	}
}

const industryService = IndustryService.getInstance();
export default industryService;

import type { Action, Form_Action } from "@/lib/types/new_type/action";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ActionsService extends BaseService<Action, Form_Action> {
	private static instance: ActionsService;

	private constructor() {
		super(APIRoutes.ACTIONS);
	}

	/**
	 * Retrieves the singleton instance of ActionsService.
	 * @returns {ActionsService} - The singleton instance.
	 */
	public static getInstance(): ActionsService {
		if (!ActionsService.instance) {
			ActionsService.instance = new ActionsService();
		}
		return ActionsService.instance;
	}
}

const actionsService = ActionsService.getInstance();
export default actionsService;

// src/services/contact.service.ts

import type {
	ActionType,
	Form_ActionType,
} from "@/lib/types/new_type/action_type";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class ActionTypeService extends BaseService<ActionType, Form_ActionType> {
	private static instance: ActionTypeService;

	private constructor() {
		super(APIRoutes.ACTION_TYPES);
	}

	/**
	 * Retrieves the singleton instance of ActionTypeService.
	 * @returns {ActionTypeService} - The singleton instance.
	 */
	public static getInstance(): ActionTypeService {
		if (!ActionTypeService.instance) {
			ActionTypeService.instance = new ActionTypeService();
		}
		return ActionTypeService.instance;
	}
}

const actionTypeService = ActionTypeService.getInstance();
export default actionTypeService;

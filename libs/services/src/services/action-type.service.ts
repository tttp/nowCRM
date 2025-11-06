// src/services/contact.service.ts

import { API_ROUTES_STRAPI } from "../api-routes/api-routes-strapi";
import type { ActionType, Form_ActionType } from "../types/action-type";
import BaseService from "./common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class ActionTypeService extends BaseService<ActionType, Form_ActionType> {
	public constructor() {
		super(API_ROUTES_STRAPI.ACTION_TYPES);
	}
}
export const actionTypeService = new ActionTypeService();

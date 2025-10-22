// src/services/contact.service.ts

import type {
	Form_Subscription,
	Subscription,
} from "@/lib/types/new_type/subscription";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class SubscriptionsService extends BaseService<
	Subscription,
	Form_Subscription
> {
	private static instance: SubscriptionsService;

	private constructor() {
		super(APIRoutes.SUBSCRIPTIONS);
	}

	/**
	 * Retrieves the singleton instance of SubscriptionsService.
	 * @returns {SubscriptionsService} - The singleton instance.
	 */
	public static getInstance(): SubscriptionsService {
		if (!SubscriptionsService.instance) {
			SubscriptionsService.instance = new SubscriptionsService();
		}
		return SubscriptionsService.instance;
	}
}

const subscriptionsService = SubscriptionsService.getInstance();
export default subscriptionsService;

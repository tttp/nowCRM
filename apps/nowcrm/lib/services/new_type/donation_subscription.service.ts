import type {
	DonationSubscription,
	Form_DonationSubscription,
} from "@/lib/types/new_type/donation_subscription";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class DonationSubscriptionService extends BaseService<
	DonationSubscription,
	Form_DonationSubscription
> {
	private static instance: DonationSubscriptionService;

	private constructor() {
		super(APIRoutes.DONATION_SUBSCRIPTIONS);
	}

	/**
	 * Retrieves the singleton instance of DonationSubscriptionService.
	 * @returns {DonationSubscriptionService} - The singleton instance.
	 */
	public static getInstance(): DonationSubscriptionService {
		if (!DonationSubscriptionService.instance) {
			DonationSubscriptionService.instance = new DonationSubscriptionService();
		}
		return DonationSubscriptionService.instance;
	}
}

const donationSubscriptionService = DonationSubscriptionService.getInstance();
export default donationSubscriptionService;

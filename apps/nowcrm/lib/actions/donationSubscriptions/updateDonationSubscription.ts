// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import donationSubscriptionService from "@/lib/services/new_type/donation_subscription.service";
import type {
	DonationSubscription,
	Form_DonationSubscription,
} from "@/lib/types/new_type/donation_subscription";

export async function updateDonationSubscription(
	id: number,
	values: Partial<Form_DonationSubscription>,
): Promise<StandardResponse<DonationSubscription>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await donationSubscriptionService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating contact:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

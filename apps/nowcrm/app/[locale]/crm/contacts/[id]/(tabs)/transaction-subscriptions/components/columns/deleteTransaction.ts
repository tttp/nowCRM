// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import donationSubscriptionService from "@/lib/services/new_type/donation_subscription.service";

export async function deleteDonationSubscriptionAction(
	transaction: number,
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const response = await donationSubscriptionService.unPublish(transaction);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete donation subscription");
	}
}

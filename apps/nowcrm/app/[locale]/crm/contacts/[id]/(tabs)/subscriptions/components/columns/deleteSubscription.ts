// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";

export async function deleteSubscriptionAction(
	subscriptionId: number,
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
		const response = await subscriptionsService.delete(subscriptionId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Subscription");
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";
import type { Subscription } from "@/lib/types/new_type/subscription";
export async function createSubscription(
	channel: number,
	contact: number,
): Promise<StandardResponse<Subscription>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await subscriptionsService.create({
			channel: channel,
			contact: contact,
			active: false,
			subscribed_at: new Date(),
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

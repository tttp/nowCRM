// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";

export async function massDeactivateSubscriptions(
	subscriptions: number[],
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
		const unpublishPromises = subscriptions.map((id) =>
			subscriptionsService.update(id, { active: false }),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Subscription:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

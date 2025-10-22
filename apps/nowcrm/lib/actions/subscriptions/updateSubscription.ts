// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";
import type {
	Form_Subscription,
	Subscription,
} from "@/lib/types/new_type/subscription";

export async function updateSubscription(
	id: number,
	values: Partial<Form_Subscription>,
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
		const res = await subscriptionsService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating journey:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

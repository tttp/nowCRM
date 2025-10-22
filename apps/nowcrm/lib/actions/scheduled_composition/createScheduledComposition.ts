"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import scheduledCompositionService from "@/lib/services/new_type/scheduledComposition.service";
import type {
	Form_ScheduledComposition,
	ScheduledComposition,
} from "@/lib/types/new_type/sceduled_composition";

export async function createScheduledCompositions(
	values: Form_ScheduledComposition,
): Promise<StandardResponse<ScheduledComposition>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Unauthorized",
		};
	}

	try {
		const res = await scheduledCompositionService.create(values);
		if (!res.data || !res.success) {
			console.error(
				`Error creating scheduled composition: ${res.errorMessage}`,
			);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: res.errorMessage,
			};
		}
		const created = await scheduledCompositionService.findOne(res.data.id, {
			populate: ["composition", "channel"],
		});
		return created;
	} catch (error) {
		console.error("Error creating scheduled composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

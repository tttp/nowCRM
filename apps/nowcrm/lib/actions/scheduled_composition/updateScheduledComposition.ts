"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import scheduledCompositionService from "@/lib/services/new_type/scheduledComposition.service";
import type {
	Form_ScheduledComposition,
	ScheduledComposition,
} from "@/lib/types/new_type/sceduled_composition";

export async function updateScheduledCompositions(
	id: number,
	values: Partial<Form_ScheduledComposition>,
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
		const res = await scheduledCompositionService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating scheduled composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

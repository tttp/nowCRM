"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import scheduledCompositionService from "@/lib/services/new_type/scheduledComposition.service";

export async function deleteScheduledCompositions(
	id: number,
): Promise<StandardResponse<null>> {
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
		const res = await scheduledCompositionService.delete(id);
		return res;
	} catch (error) {
		console.error("Error deleting scheduled composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

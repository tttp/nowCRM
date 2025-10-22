// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeysService from "@/lib/services/new_type/journeys.service";

export async function deleteJourneyAction(
	journeyId: number,
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
		const response = await journeysService.fullDelete(journeyId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Contact");
	}
}

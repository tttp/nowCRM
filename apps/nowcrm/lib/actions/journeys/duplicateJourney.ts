"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeysService from "@/lib/services/new_type/journeys.service";

export async function duplicateJourneyAction(
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
		const response = await journeysService.duplicate(journeyId);
		console.log("Journey duplicated successfully", response);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to duplicate journey");
	}
}

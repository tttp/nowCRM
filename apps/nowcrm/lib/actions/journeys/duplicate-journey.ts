"use server";

import { auth } from "@/auth";
import { handleError, journeysService, StandardResponse } from "@nowcrm/services/server";

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
		const response = await journeysService.duplicate(journeyId,session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

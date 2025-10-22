// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeyStepsService from "@/lib/services/new_type/journeySteps.service";
import type { JourneyStep } from "@/lib/types/new_type/journeyStep";

export async function MassAddToJourney(
	contactIds: number[],
	listId: number,
): Promise<StandardResponse<JourneyStep>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await journeyStepsService.update(listId, {
			contacts: { connect: contactIds },
		});
		return res;
	} catch (error) {
		console.error("Error adding to list:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

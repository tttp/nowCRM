// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeyStepsService from "@/lib/services/new_type/journeySteps.service";

export async function massDeleteJourneys(
	contactIds: number[],
	journeyStepId: number,
): Promise<StandardResponse<null>> {
	console.log(contactIds, journeyStepId);
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		await journeyStepsService.update(journeyStepId, {
			contacts: {
				disconnect: contactIds,
			},
		});
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error during removing contact:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

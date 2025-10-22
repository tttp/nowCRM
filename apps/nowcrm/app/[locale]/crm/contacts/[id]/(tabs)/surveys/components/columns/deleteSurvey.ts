// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import surveysService from "@/lib/services/new_type/surveys.service";

export async function deleteSurveyAction(
	survey: number,
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
		const response = await surveysService.unPublish(survey);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete survey");
	}
}

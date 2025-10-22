// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import surveyItemsSerivces from "@/lib/services/new_type/surveyItems.service";

export async function deleteSurveyItemAction(
	listId: number,
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
		const response = await surveyItemsSerivces.unPublish(listId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Contact");
	}
}

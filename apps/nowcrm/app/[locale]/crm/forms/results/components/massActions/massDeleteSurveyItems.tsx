// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import surveryItemsService from "@/lib/services/new_type/surveyItems.service";

export async function MassDeleteSurveyItems(
	surveyItems: number[],
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
		const unpublishPromises = surveyItems.map((id) =>
			surveryItemsService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Survey Items:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

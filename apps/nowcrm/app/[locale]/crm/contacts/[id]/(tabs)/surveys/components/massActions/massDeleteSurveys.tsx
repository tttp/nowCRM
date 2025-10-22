// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import surveysService from "@/lib/services/new_type/surveys.service";

export async function massDeleteSurveys(
	surveys: number[],
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
		const unpublishPromises = surveys.map((id) => surveysService.unPublish(id));
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Survey:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

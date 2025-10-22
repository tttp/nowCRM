// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import formsService from "@/lib/services/new_type/forms.service";

export async function deleteFormAction(
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
		const response = await formsService.unPublish(journeyId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Form");
	}
}

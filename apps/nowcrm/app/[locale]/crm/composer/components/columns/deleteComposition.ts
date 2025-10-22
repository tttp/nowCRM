// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";

export async function deleteCompositionAction(
	compositionId: number,
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
		const response = await composerService.unPublish(compositionId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete composition");
	}
}

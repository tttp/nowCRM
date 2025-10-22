// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import actionsService from "@/lib/services/new_type/actions.service";

export async function deleteAction(
	action: number,
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
		const response = await actionsService.unPublish(action);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete action");
	}
}

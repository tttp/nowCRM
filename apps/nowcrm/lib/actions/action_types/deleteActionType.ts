// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import actionTypeService from "@/lib/services/new_type/action_type.service";

export async function deleteActionType(
	actionTypeId: number,
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
		const response = await actionTypeService.unPublish(actionTypeId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete action type");
	}
}

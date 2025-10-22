// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import actionTypeService from "@/lib/services/new_type/action_type.service";

export async function MassDeleteActionTypes(
	actionTypes: number[],
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
		const unpublishPromises = actionTypes.map((id) =>
			actionTypeService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting action types:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

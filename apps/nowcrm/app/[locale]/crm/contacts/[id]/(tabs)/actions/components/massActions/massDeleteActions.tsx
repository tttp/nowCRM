// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import actionsService from "@/lib/services/new_type/actions.service";

export async function massDeleteActions(
	actions: number[],
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
		const unpublishPromises = actions.map((id) => actionsService.unPublish(id));
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error: any) {
		console.error("Error deleting actions:", error);
		return {
			data: null,
			status: error.status,
			success: false,
			errorMessage: error.message,
		};
	}
}

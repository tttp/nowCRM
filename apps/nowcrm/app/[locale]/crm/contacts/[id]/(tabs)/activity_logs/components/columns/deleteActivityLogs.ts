// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import activityLogsService from "@/lib/services/new_type/activity_logs.service";

export async function deleteActivityLogAction(
	activity_log: number,
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
		const response = await activityLogsService.unPublish(activity_log);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete activitylog ${error}`);
	}
}

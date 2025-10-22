// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import activityLogsService from "@/lib/services/new_type/activity_logs.service";

export async function MassRemoveActivityLogs(
	activity_logs: number[],
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
		activity_logs.map(async (id) => await activityLogsService.unPublish(id));
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error removing activity logs:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

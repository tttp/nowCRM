// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import activityLogsService from "@/lib/services/new_type/activity_logs.service";
import type {
	ActivityLog,
	Form_ActivityLog,
} from "@/lib/types/new_type/activity_log";

export async function createActivityLog(
	values: Form_ActivityLog,
): Promise<StandardResponse<ActivityLog>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await activityLogsService.create({
			...values,
			user: session.user.strapi_id,
		});
		return res;
	} catch (error) {
		console.error("Error creating activity log:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

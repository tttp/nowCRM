// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import tasksService from "@/lib/services/new_type/tasks.service";

export async function deleteTaskAction(
	task: number,
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
		const response = await tasksService.unPublish(task);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete task");
	}
}

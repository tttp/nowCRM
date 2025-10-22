// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import tasksService from "@/lib/services/new_type/tasks.service";
import type { Form_Task, Task } from "@/lib/types/new_type/task";

export async function createTask(
	values: Form_Task,
): Promise<StandardResponse<Task>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await tasksService.create(values);
		return res;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import tasksService from "@/lib/services/new_type/tasks.service";

export async function MassRemoveTasks(
	tasks: number[],
	_contactId: number,
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
		tasks.map(async (id) => await tasksService.unPublish(id));
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error removing tasks:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import eventsService from "@/lib/services/new_type/events.service";

export async function deleteEventAction(
	event: number,
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
		const response = await eventsService.unPublish(event);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete event");
	}
}

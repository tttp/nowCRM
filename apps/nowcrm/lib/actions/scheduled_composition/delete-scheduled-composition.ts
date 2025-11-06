"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { compositionScheduledsService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function deleteScheduledCompositions(
	id: DocumentId,
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
		const res = await compositionScheduledsService.delete(id,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

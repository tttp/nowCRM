// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, StandardResponse } from "@nowcrm/services/server";
import { compositionsService } from "@nowcrm/services/server";
export async function deleteCompositionAction(
	compositionId: DocumentId,
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
		const response = await compositionsService.delete(compositionId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

"use server";

import { auth } from "@/auth";
import { handleError, listsService, StandardResponse } from "@nowcrm/services/server";
import { DocumentId } from "@nowcrm/services";

export async function duplicateListAction(
	listId: DocumentId,
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
		const response = await listsService.duplicate(listId,session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

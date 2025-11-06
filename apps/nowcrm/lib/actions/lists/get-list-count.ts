// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, listsService, StandardResponse } from "@nowcrm/services/server";

export async function getListCount(
	listId: DocumentId,
): Promise<StandardResponse<number>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await listsService.countContacts(listId,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

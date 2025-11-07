// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, listsService, StandardResponse } from "@nowcrm/services/server";

export async function MassDisconnectContacts(
	listId: DocumentId,
	contacts: DocumentId[],
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
		await listsService.update(listId, { contacts: { disconnect: contacts } }, session.jwt);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}

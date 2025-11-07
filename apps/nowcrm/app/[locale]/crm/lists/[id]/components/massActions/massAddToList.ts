// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId, List } from "@nowcrm/services";
import { handleError, listsService, StandardResponse } from "@nowcrm/services/server";

export async function MassAddToList(
	contactIds: DocumentId[],
	listId: DocumentId,
): Promise<StandardResponse<List>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await listsService.update(listId, {
			contacts: { connect: contactIds },
		}, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

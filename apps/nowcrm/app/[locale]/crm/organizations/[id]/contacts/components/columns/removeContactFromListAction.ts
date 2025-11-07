// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId, List } from "@nowcrm/services";
import { organizationsService, StandardResponse } from "@nowcrm/services/server";
import { handleError } from "@nowcrm/services/server";

export async function removeContactFromListAction(
	organizationId: DocumentId,
	contactId: DocumentId,
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
		const response = await organizationsService.update(organizationId, {
			contacts: { disconnect: [contactId] },
		}, session.jwt,);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

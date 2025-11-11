// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";

import { DocumentId } from "@nowcrm/services";
import { handleError, organizationTypesService, StandardResponse } from "@nowcrm/services/server";

export async function deleteOrganizationTypeAction(
	organizationTypeId: DocumentId,
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
		const response =
			await organizationTypesService.delete(organizationTypeId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

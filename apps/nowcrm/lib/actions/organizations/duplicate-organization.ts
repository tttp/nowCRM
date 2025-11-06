"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, organizationsService, StandardResponse } from "@nowcrm/services/server";

export async function duplicateOrganizationAction(
	organizationId: DocumentId,
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
		const response = await organizationsService.duplicate(organizationId,session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

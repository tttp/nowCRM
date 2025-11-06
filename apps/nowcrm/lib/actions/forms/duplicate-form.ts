"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { formsService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function duplicateFormAction(
	formId: DocumentId,
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
		const response = await formsService.duplicate(formId, session.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

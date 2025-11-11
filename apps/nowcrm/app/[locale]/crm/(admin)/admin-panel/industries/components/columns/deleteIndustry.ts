// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, industriesService, StandardResponse } from "@nowcrm/services/server";

export async function deleteIndustryAction(
	industryId: DocumentId,
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
		const response = await industriesService.delete(industryId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

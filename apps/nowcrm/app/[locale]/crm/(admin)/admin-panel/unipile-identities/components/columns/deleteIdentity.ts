// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";

import { DocumentId } from "@nowcrm/services";
import { StandardResponse, unipileIdentitiesService } from "@nowcrm/services/server";
import { handleError } from "@nowcrm/services/server";

export async function deleteUnipileIdentityAction(
	identityId: DocumentId,
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
		const response = await unipileIdentitiesService.delete(identityId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

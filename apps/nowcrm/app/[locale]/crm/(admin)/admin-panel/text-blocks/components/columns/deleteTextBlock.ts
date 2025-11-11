// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";

import { DocumentId } from "@nowcrm/services";
import { handleError, textblocksService, StandardResponse } from "@nowcrm/services/server";
export async function deleteTextBlock(
	textblockId: DocumentId,
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
		const response = await textblocksService.delete(textblockId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

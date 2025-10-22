// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import documentsService from "@/lib/services/new_type/documents.service";

export async function deleteAction(
	document: number,
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
		const response = await documentsService.unPublish(document);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete document ${error}`);
	}
}

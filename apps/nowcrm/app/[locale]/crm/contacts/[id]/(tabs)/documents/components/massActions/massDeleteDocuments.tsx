// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import documentsService from "@/lib/services/new_type/documents.service";

export async function massDeleteDocuments(
	documents: number[],
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
		const unpublishPromises = documents.map((id) =>
			documentsService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error: any) {
		console.error("Error deleting documents:", error);
		return {
			data: null,
			status: error.status,
			success: false,
			errorMessage: error.message,
		};
	}
}

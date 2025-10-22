// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import listsService from "@/lib/services/new_type/lists.service";

export async function deleteListAction(
	listId: number,
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
		const response = await listsService.unPublish(listId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Contact");
	}
}

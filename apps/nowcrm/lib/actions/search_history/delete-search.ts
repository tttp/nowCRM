"use server";
import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, searchHistoryTemplatesService, StandardResponse } from "@nowcrm/services/server";

export async function deleteSearch(id: DocumentId): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await searchHistoryTemplatesService.delete(id,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

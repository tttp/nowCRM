// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { dalService, handleError, StandardResponse } from "@nowcrm/services/server";
export async function  addContactsToListByFilters(
    filters: Record<string, any>,
    listId: DocumentId,
): Promise<StandardResponse<any>> {

	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
        const res = await dalService.addContactsToListByFilters(filters, listId);
        return res;
	} catch (error) {
		return handleError(error);
	}
}

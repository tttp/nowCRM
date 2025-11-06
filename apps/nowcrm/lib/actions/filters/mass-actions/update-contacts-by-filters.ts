// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { dalService, handleError, StandardResponse } from "@nowcrm/services/server";
export async function updateContactsByFilters(
    filters: Record<string, any>,
    updateData: Record<string, any>,
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
       const res = await dalService.updateContactsByFilters(filters, updateData);
       return res;
	} catch (error) {
		return handleError(error);
	}
}

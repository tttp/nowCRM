// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { dalService, handleError, StandardResponse } from "@nowcrm/services/server";
export async function exportContactsByFilters(payload: {
    entity: string;
    searchMask: any;
    mass_action: string;
}): Promise<StandardResponse<any>> {



	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

    const userEmail = session.user?.email ?? "unknown@unknown.com";
	try {
        const res = await dalService.exportContactsByFilters(payload, userEmail);

        return res;
	} catch (error) {
		return handleError(error);
	}
}

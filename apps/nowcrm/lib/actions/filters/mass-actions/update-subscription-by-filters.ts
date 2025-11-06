// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import {  DocumentId } from "@nowcrm/services";
import { dalService, handleError, StandardResponse } from "@nowcrm/services/server";
export async function  UpdateSubscriptionContactsByFilters(
    filters: Record<string, any>,
    channelId: DocumentId,
    isSubscribe: boolean,
    addEvent?: boolean,
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
       const res = await dalService.updateSubscriptionContactsByFilters(filters, channelId, isSubscribe, addEvent);
       return res;
	} catch (error) {
		return handleError(error);
	}
}

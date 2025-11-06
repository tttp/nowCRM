// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";

import {  handleError, StandardResponse, composerService } from "@nowcrm/services/server";
export async function sendCompositionByFilters(
    filters: Record<string, any>,
    compositionId: DocumentId,
    channelNames: string[],
    subject: string,
    from: string,
    interval: number,
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
        const res = await composerService.sendCompositionByFilters(filters, compositionId, channelNames, subject, from, interval);
        return res;
	} catch (error) {
		return handleError(error);
	}
}

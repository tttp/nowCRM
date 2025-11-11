// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, frequenciesService, StandardResponse } from "@nowcrm/services/server";

export async function deleteFrequencyAction(
	frequencyId: DocumentId,
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
		const response = await frequenciesService.delete(frequencyId, session?.jwt);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

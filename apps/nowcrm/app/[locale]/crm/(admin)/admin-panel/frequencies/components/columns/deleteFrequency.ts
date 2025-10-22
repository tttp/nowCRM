// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import frequencyService from "@/lib/services/new_type/frequency.service";

export async function deleteFrequencyAction(
	frequencyId: number,
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
		const response = await frequencyService.unPublish(frequencyId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete frequency");
	}
}

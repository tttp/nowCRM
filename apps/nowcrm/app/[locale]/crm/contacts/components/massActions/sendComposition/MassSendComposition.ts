// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";

export async function MassSendComposition(
	contactIds: number[],
	compositionId: number,
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
		return await composerService.sendCompositionByIds(
			contactIds,
			compositionId,
			channelNames,
			subject,
			from,
			interval,
		);
	} catch (error) {
		console.error("[MassSendComposition] action error:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: (error as Error).message,
		};
	}
}

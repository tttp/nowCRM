// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import textBlockService from "@/lib/services/new_type/text_blocks.service";

export async function deleteTextBlock(
	textblockId: number,
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
		const response = await textBlockService.unPublish(textblockId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete organization type");
	}
}

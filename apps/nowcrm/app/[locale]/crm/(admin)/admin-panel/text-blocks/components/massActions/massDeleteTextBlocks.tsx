// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import textBlockService from "@/lib/services/new_type/text_blocks.service";

export async function MassDeleteTextBlocks(
	textBlocks: number[],
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
		const unpublishPromises = textBlocks.map((id) =>
			textBlockService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting text blocks:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import textBlockService from "@/lib/services/new_type/text_blocks.service";
import type {
	Form_TextBlock,
	TextBlock,
} from "@/lib/types/new_type/text_blocks";

export async function updateTextBlock(
	id: number,
	values: Partial<Form_TextBlock>,
): Promise<StandardResponse<TextBlock>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await textBlockService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating journey:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

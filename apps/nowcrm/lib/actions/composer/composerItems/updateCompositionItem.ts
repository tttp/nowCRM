// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerItemService from "@/lib/services/new_type/composerItems.service";
import type {
	CompositionItem,
	Form_CompositionItem,
} from "@/lib/types/new_type/composition";

export async function updateCompositionItem(
	id: number,
	values: Partial<Form_CompositionItem>,
): Promise<StandardResponse<CompositionItem>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerItemService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating contact:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerItemService from "@/lib/services/new_type/composerItems.service";
import type { CompositionItem } from "@/lib/types/new_type/composition";

export async function getCompositionItems(): Promise<
	StandardResponse<CompositionItem[]>
> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const item = await composerItemService.find({
			populate: {
				composition: "*",
				channel: "*",
			},
		});
		return item;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

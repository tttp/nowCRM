// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import TagService from "@/lib/services/new_type/tag.service";

export async function deleteTag(
	tagId: number,
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
		const response = await TagService.delete(tagId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete tag");
	}
}

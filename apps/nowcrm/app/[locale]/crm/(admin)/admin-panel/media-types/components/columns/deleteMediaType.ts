// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import mediaTypeService from "@/lib/services/new_type/media_type.service";

export async function deleteMediaTypeAction(
	mediaTypeId: number,
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
		const response = await mediaTypeService.unPublish(mediaTypeId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete media type");
	}
}

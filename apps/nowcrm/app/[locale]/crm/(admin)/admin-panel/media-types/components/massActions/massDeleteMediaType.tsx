// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import mediaTypeService from "@/lib/services/new_type/media_type.service";

export async function MassDeleteMediaTypes(
	mediaTypes: number[],
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
		const unpublishPromises = mediaTypes.map((id) =>
			mediaTypeService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting mediaTypes:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

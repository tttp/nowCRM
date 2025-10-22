// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import mediaTypeService from "@/lib/services/new_type/media_type.service";
import type { MediaType } from "@/lib/types/new_type/media_type";

export async function createMediaType(
	name: string,
): Promise<StandardResponse<MediaType>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await mediaTypeService.create({
			name,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating Media Type:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { MediaType } from "@nowcrm/services";
import { handleError, mediaTypesService, StandardResponse } from "@nowcrm/services/server";

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
		const res = await mediaTypesService.create({
			name,
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

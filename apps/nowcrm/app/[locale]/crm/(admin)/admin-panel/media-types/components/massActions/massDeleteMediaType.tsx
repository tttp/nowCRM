// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";

import { DocumentId } from "@nowcrm/services";

import { handleError, mediaTypesService, StandardResponse } from "@nowcrm/services/server";

export async function MassDeleteMediaTypes(
	mediaTypes: DocumentId[],
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
			mediaTypesService.delete(id, session?.jwt),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}

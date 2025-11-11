// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { compositionsService, handleError, StandardResponse } from "@nowcrm/services/server";
import { DocumentId } from "@nowcrm/services";

export async function MassDeleteCompositions(
	compositions: DocumentId[],
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
		const unpublishPromises = compositions.map((id) =>
			compositionsService.delete(id, session.jwt),
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

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, frequenciesService, StandardResponse } from "@nowcrm/services/server";
export async function MassDeleteFrequencies(
	frequencies: DocumentId[],
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
		const unpublishPromises = frequencies.map((id) =>
			frequenciesService.delete(id, session?.jwt),
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

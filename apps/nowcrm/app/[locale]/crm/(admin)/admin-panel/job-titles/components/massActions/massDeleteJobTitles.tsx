"use server";

import { auth } from "@/auth";

import { DocumentId } from "@nowcrm/services";
import { handleError, contactJobTitlesService, StandardResponse } from "@nowcrm/services/server";
export async function MassDeleteJobTitles(
	jobTitles: DocumentId[],
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
		const unpublishPromises = jobTitles.map((id) =>
			contactJobTitlesService.delete(id, session?.jwt),
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

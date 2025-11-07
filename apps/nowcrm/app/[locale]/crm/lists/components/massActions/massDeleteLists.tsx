// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { handleError, listsService, StandardResponse } from "@nowcrm/services/server";

export async function MassDeleteLists(
	lists: DocumentId[],
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
		const unpublishPromises = lists.map((id) => listsService.delete(id, session.jwt));
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

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import { actionTypeService, StandardResponse } from "@nowcrm/services/server";
import { DocumentId } from "@nowcrm/services";
import { handleError } from "@nowcrm/services/server";
export async function MassDeleteActionTypes(
	actionTypes: DocumentId[],
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
		const unpublishPromises = actionTypes.map((id) =>
			actionTypeService.delete(session?.jwt, id.toString()),
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

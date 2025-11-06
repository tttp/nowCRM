// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId, Form_Journey, Journey } from "@nowcrm/services";
import { handleError, journeysService, StandardResponse } from "@nowcrm/services/server";

export async function updateJourney(
	id: DocumentId,
	values: Partial<Form_Journey>,
): Promise<StandardResponse<Journey>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await journeysService.update(id, values,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

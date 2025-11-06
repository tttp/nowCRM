// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId, Form_Identity, Identity } from "@nowcrm/services";
import { identitiesService, StandardResponse } from "@nowcrm/services/server";
import { handleError } from "@nowcrm/services/server";


export async function updateIdentity(
	id: DocumentId,
	values: Partial<Form_Identity>,
): Promise<StandardResponse<Identity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await identitiesService.update(id, values, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

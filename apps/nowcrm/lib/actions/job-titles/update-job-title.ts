"use server";
import { auth } from "@/auth";
import { ContactJobTitle, DocumentId } from "@nowcrm/services";
import { contactJobTitlesService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function updateJobTitle(
	id: DocumentId,
	name: string,
): Promise<StandardResponse<ContactJobTitle>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactJobTitlesService.update(id, {
			name: name,
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

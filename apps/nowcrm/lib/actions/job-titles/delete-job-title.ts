"use server";
import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { contactJobTitlesService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function deleteJobTitleAction(
	id: DocumentId,
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
		const res = await contactJobTitlesService.delete(id,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

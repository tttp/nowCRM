// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { FormEntity } from "@nowcrm/services";
import { formsService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function createForm(
	name: string,
): Promise<StandardResponse<FormEntity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await formsService.create({
			name: name,
			active: false,
			publishedAt: new Date(),
		}, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

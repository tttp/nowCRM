// actions/createJobTitle.ts
"use server";
import { auth } from "@/auth";
import { ContactJobTitle } from "@nowcrm/services";
import { contactJobTitlesService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function createJobTitle(
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
		const res = await contactJobTitlesService.create({
			name: name,
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

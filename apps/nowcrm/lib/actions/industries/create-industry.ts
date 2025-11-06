// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { Industry } from "@nowcrm/services";
import { handleError,industriesService, StandardResponse } from "@nowcrm/services/server";

export async function createIndustry(
	name: string,
): Promise<StandardResponse<Industry>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await industriesService.create({
			name: name,
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

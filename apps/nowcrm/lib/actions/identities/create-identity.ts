// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { Identity } from "@nowcrm/services";
import { handleError, identitiesService, StandardResponse } from "@nowcrm/services/server";

export async function createIdentity(
	name: string,
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
		const res = await identitiesService.create({
			name,
			publishedAt: new Date(),
		}, session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

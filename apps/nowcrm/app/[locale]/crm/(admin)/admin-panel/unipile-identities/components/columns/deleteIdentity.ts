// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import unipleIdentityService from "@/lib/services/new_type/unipile_identity.service";

export async function deleteUnipileIdentityAction(
	identityId: number,
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
		const response = await unipleIdentityService.unPublish(identityId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete identity");
	}
}

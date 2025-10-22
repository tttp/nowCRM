// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import unipleIdentityService from "@/lib/services/new_type/unipile_identity.service";
import type { UnipileIdentity } from "@/lib/types/new_type/unipile_identity";

export async function getUnipileIdentity(
	id: number,
): Promise<StandardResponse<UnipileIdentity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const identity = await unipleIdentityService.findOne(id);

		return identity;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

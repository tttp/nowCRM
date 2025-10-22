// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";

import unipleIdentityService from "@/lib/services/new_type/unipile_identity.service";

export async function MassDeleteUnipileIdentities(
	identities: number[],
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
		const unpublishPromises = identities.map((id) =>
			unipleIdentityService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting identities:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

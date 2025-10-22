// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import identityService from "@/lib/services/new_type/identity.service";
import type { Form_Identity, Identity } from "@/lib/types/new_type/identity";

export async function updateIdentity(
	id: number,
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
		const res = await identityService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating identity:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

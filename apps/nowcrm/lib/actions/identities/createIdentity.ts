// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import identityService from "@/lib/services/new_type/identity.service";
import type { Identity } from "@/lib/types/new_type/identity";

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
		const res = await identityService.create({
			name,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating identity:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

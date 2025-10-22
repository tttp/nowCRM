// contactsapp/lib/actions/composer/createReference.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { ReferenceComposition } from "@/lib/types/new_type/composition";

export async function createReference(
	values: ReferenceComposition,
): Promise<StandardResponse<{ result: string }>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerService.createReference(values);
		return res;
	} catch (error) {
		console.error("Error creating composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

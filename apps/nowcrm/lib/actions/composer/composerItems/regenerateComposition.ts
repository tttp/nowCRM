// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { createAdditionalComposition } from "@/lib/types/new_type/composition";

export async function regenerateItemResult(
	values: createAdditionalComposition,
): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerService.regenerateItemResult(values);
		return res;
	} catch (error) {
		console.error("Error regenerating item result:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

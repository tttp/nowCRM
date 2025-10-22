// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { createComposition } from "@/lib/types/new_type/composition";

export async function createCompositionFull(
	values: createComposition,
): Promise<StandardResponse<string | null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const result = await composerService.createComposition(values);
		return {
			data: result.data,
			status: 200,
			success: true,
		};
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

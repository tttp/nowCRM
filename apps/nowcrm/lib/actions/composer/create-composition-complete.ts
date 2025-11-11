// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { createComposition } from "@nowcrm/services";
import { composerService, StandardResponse } from "@nowcrm/services/server";


export async function createCompositionFull(
	values: Partial<createComposition>,
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

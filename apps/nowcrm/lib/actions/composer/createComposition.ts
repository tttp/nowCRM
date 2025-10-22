// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type {
	Composition,
	Form_Composition,
} from "@/lib/types/new_type/composition";

export async function createComposition(
	values: Form_Composition,
): Promise<StandardResponse<Composition>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerService.create(values);
		console.log(res);
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

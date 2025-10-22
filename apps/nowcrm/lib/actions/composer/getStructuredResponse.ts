// contactsapp/lib/actions/composer/getStructuredResponse.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { StructuredResponseModel } from "@/lib/types/new_type/composition";

export async function structuredResponse(
	values: StructuredResponseModel,
): Promise<StandardResponse<{ result: any }>> {
	const session = await auth();

	console.log("Requesting structured respobse: ");
	console.log(values);
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerService.requestStructuredResponse(values);
		console.log("[ACTION structuredResponse] Got structured response:");
		console.log(res);

		return res;
	} catch (error) {
		console.error("Error craeting a structured response :", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

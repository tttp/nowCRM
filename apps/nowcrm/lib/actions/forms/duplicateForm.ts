"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import formsService from "@/lib/services/new_type/forms.service";

export async function duplicateFormAction(
	formId: number,
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
		const response = await formsService.duplicate(formId);
		console.log("Form duplicated successfully", response);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to duplicate form");
	}
}

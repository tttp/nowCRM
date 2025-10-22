// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import formsService from "@/lib/services/new_type/forms.service";

export async function massDeleteForms(
	forms: number[],
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
		const unpublishPromises = forms.map((id) => formsService.unPublish(id));
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Lists:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

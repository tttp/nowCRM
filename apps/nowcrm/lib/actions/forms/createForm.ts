// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import formsService from "@/lib/services/new_type/forms.service";
import type { FormEntity } from "@/lib/types/new_type/form";

export async function createForm(
	name: string,
): Promise<StandardResponse<FormEntity>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await formsService.create({
			name: name,
			active: false,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import settingsService from "@/lib/services/new_type/settings.service";
import type { Form_Settings, Settings } from "@/lib/types/new_type/settings";

export async function updateSettings(
	id: number,
	values: Partial<Form_Settings>,
): Promise<StandardResponse<Settings>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await settingsService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating settings:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

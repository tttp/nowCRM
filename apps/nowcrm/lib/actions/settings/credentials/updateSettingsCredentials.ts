// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import settingsCredentialsService from "@/lib/services/new_type/settings_credentials.service";
import type {
	Form_SettingCredential,
	SettingCredential,
} from "@/lib/types/new_type/settings";

export async function updateSettingCredentials(
	id: number,
	values: Partial<Form_SettingCredential>,
): Promise<StandardResponse<SettingCredential>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await settingsCredentialsService.update(id, values);
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

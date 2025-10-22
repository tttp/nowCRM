// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import settingsCredentialsService from "@/lib/services/new_type/settings_credentials.service";
import type { SettingCredential } from "@/lib/types/new_type/settings";
export async function createSettingCredential(
	name: string,
	settings: number,
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
		const res = await settingsCredentialsService.create({
			name: name,
			setting: settings,
			status: "disconnected",
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

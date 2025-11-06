// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { DocumentId, SettingCredential } from "@nowcrm/services";
import { StandardResponse } from "@nowcrm/services/server";
import { settingCredentialsService } from "@nowcrm/services/server";
import { handleError } from "@nowcrm/services/server";
export async function createSettingCredential(
	name: string,
	settings: DocumentId,
): Promise<StandardResponse<SettingCredential>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await settingCredentialsService.create({
			name: name,
			setting: settings,
			credential_status: "disconnected",
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

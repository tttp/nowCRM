// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";

export async function getUserIdentity(): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	return {
		data: `${session.user.username} <${session.user.email}>`,
		status: 200,
		success: true,
	};
}

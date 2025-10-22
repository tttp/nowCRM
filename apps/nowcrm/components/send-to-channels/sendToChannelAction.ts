// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { StandardResponse } from "@/lib/services/common/response.service";
import type { sendToChannelsData } from "./sendToChannelType";

export async function sendToChannelAction(
	data: sendToChannelsData,
): Promise<StandardResponse<{ result: string }>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const url = `${env.CRM_COMPOSER_API_URL}send-to-channels`;
		const rez = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
			body: JSON.stringify({
				...data,
				from: data.from
					? data.from
					: `${session.user.username} <${session.user.email}>`,
			}),
		});

		const response = await rez.json();
		return {
			data: response.responseObject,
			status: response.statusCode,
			success: response.success,
			errorMessage: response.message,
		};
	} catch (_error: any) {
		return {
			data: null,
			status: 400,
			success: false,
			errorMessage: "error",
		};
	}
}

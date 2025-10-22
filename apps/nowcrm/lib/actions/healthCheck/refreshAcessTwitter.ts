// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { StandardResponse } from "@/lib/services/common/response.service";

export async function refreshAccessTwitter(): Promise<
	StandardResponse<string>
> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const url = `${env.CRM_COMPOSER_API_URL}send-to-channels/get-callback-twitter`;
		const rez = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		console.log(rez);
		const response = await rez.json();
		return {
			data: response.responseObject,
			status: 200,
			success: true,
		};
	} catch (error: any) {
		console.log(error);
		return {
			data: null,
			status: 400,
			success: false,
			errorMessage: "error",
		};
	}
}

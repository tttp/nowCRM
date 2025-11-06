// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import { handleError, StandardResponse } from "@nowcrm/services/server";

export async function refreshAccessLinkedin(): Promise<
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
		const url = `${env.CRM_COMPOSER_API_URL}send-to-channels/get-callback-linkedin`;
		const rez = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});
		const response = await rez.json();
		return {
			data: response.responseObject,
			status: 200,
			success: true,
		};
	} catch (error: any) {
		return handleError(error);
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { StandardResponse } from "@/lib/services/common/response.service";

export async function runHealthCheck(): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const url = `${env.CRM_COMPOSER_API_URL}send-to-channels/health-check`;
		await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});
		return {
			data: null,
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

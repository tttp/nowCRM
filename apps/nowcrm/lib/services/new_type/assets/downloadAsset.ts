// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import {
	handleError,
	type StandardResponse,
} from "@/lib/services/common/response.service";
import type Asset from "./asset";
import assetsService from "./assets.service";

export async function uploadAsset(
	form_data: FormData,
): Promise<StandardResponse<Asset[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await assetsService.upload(form_data);
		return res;
	} catch (error) {
		console.error("Error uploading asset:", error);
		return handleError(error);
	}
}

export async function getAsset(
	assetId: number,
): Promise<StandardResponse<Asset>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await assetsService.findAsset(assetId);
		return res;
	} catch (error) {
		console.error("Error uploading asset:", error);
		return handleError(error);
	}
}

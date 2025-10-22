"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignCategoryService from "@/lib/services/new_type/campaignCategory.service";
import type { CampaignCategory } from "@/lib/types/new_type/campaignCategory";

export async function createCampaignCategory(
	name: string,
	description?: string,
): Promise<StandardResponse<CampaignCategory>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await campaignCategoryService.create({
			name: name,
			description: description,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating campaign category:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

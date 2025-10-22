"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignCategoryService from "@/lib/services/new_type/campaignCategory.service";
import type { CampaignCategory } from "@/lib/types/new_type/campaignCategory";

export async function getCampaignCategories(): Promise<
	StandardResponse<CampaignCategory[]>
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
		const res = await campaignCategoryService.find({
			pagination: { page: 1, pageSize: 100 },
			sort: ["name:asc"],
		});
		return res;
	} catch (error) {
		console.error("Error fetching campaign categories:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

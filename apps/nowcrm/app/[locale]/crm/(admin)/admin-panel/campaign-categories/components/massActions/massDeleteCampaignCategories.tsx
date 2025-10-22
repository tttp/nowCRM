"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignCategoryService from "@/lib/services/new_type/campaignCategory.service";

export async function MassDeleteCampaignCategories(
	campaignCategories: number[],
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const unpublishPromises = campaignCategories.map((id) =>
			campaignCategoryService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting campaign categories:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

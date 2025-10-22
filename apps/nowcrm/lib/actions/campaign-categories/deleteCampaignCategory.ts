"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignCategoryService from "@/lib/services/new_type/campaignCategory.service";

export async function deleteCampaignCategoryAction(
	id: number,
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
		const res = await campaignCategoryService.delete(id);
		return res;
	} catch (error) {
		console.error("Error deleting campaign category:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

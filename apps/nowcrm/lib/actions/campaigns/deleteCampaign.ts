"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignService from "@/lib/services/new_type/campaign.service";

export async function deleteCampaignAction(
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
		const res = await campaignService.delete(id);
		return res;
	} catch (error) {
		console.error("Error deleting campaign:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

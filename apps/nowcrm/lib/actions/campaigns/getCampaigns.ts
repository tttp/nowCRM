"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignService from "@/lib/services/new_type/campaign.service";
import type { Campaign } from "@/lib/types/new_type/campaign";

export async function getCampaigns(): Promise<StandardResponse<Campaign[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await campaignService.find({
			pagination: { page: 1, pageSize: 100 },
			sort: ["name:asc"],
		});
		return res;
	} catch (error) {
		console.error("Error fetching campaigns:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

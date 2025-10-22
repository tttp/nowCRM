"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignService from "@/lib/services/new_type/campaign.service";
import type { Campaign } from "@/lib/types/new_type/campaign";

export async function createCampaign(
	name: string,
	description?: string,
	campaignCategoryId?: number,
): Promise<StandardResponse<Campaign>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await campaignService.create({
			name: name,
			description: description,
			campaign_category: campaignCategoryId
				? { connect: [campaignCategoryId] }
				: undefined,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating campaign:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

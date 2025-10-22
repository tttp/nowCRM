"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import campaignService from "@/lib/services/new_type/campaign.service";

export async function MassDeleteCampaigns(
	campaigns: number[],
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
		const unpublishPromises = campaigns.map((id) =>
			campaignService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting campaigns:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

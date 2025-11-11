"use server";

import { auth } from "@/auth";
import { campaignCategoriesService, handleError, StandardResponse } from "@nowcrm/services/server";
import { DocumentId } from "@nowcrm/services";
export async function MassDeleteCampaignCategories(
	campaignCategories: DocumentId[],
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
			campaignCategoriesService.delete(session?.jwt, id.toString()),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		return handleError(error);
	}
}

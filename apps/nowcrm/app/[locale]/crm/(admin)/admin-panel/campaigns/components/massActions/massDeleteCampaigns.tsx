"use server";

import { auth } from "@/auth";
import { DocumentId } from "@nowcrm/services";
import { campaignsService, handleError, StandardResponse } from "@nowcrm/services/server";

export async function MassDeleteCampaigns(
	campaigns: DocumentId[],
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
			campaignsService.delete(session?.jwt, id.toString()),
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

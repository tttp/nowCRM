"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import jobTitleService from "@/lib/services/new_type/job_title.service";

export async function MassDeleteJobTitles(
	jobTitles: number[],
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
		const unpublishPromises = jobTitles.map((id) =>
			jobTitleService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting job titles:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import jobTitleService from "@/lib/services/new_type/job_title.service";

export async function deleteJobTitleAction(
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
		const res = await jobTitleService.delete(id);
		return res;
	} catch (error) {
		console.error("Error deleting job title:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

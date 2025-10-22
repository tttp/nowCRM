"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import jobTitleService from "@/lib/services/new_type/job_title.service";
import type { JobTitle } from "@/lib/types/new_type/job_title";

export async function updateJobTitle(
	id: number,
	name: string,
): Promise<StandardResponse<JobTitle>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await jobTitleService.update(id, {
			name: name,
		});
		return res;
	} catch (error) {
		console.error("Error updating job title:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { JobCompositionRecord } from "@/lib/types/new_type/composition";

export async function getCompositionJobs(
	page = 1,
	jobsPerPage = 20,
): Promise<StandardResponse<JobCompositionRecord[]>> {
	return await composerService.getCompositionData(page, jobsPerPage);
}

// export async function getCompositionProgressMap(): Promise<
// 	StandardResponse<Map<string, number>>
// > {
// 	return await composerService.fetchProgressMap();
// }

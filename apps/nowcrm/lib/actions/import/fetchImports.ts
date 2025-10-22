"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import dalService from "@/lib/services/new_type/dal.service";
import type { ImportRecord } from "@/lib/types/new_type/import";

export async function getPreviousImports(
	page = 1,
	jobsPerPage = 20,
	type: "contacts" | "organizations" | "mass-actions" = "contacts",
): Promise<StandardResponse<ImportRecord[]>> {
	return await dalService.fetchPreviousImports(page, jobsPerPage, type);
}

export async function getImportProgressMap(): Promise<
	StandardResponse<Map<string, number>>
> {
	return await dalService.fetchProgressMap();
}

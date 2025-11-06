"use server";

import { ImportRecord } from "@nowcrm/services";
import { dalService, StandardResponse } from "@nowcrm/services/server";


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

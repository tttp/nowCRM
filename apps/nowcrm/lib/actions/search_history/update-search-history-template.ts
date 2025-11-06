// actions/search_history/updateSearch.ts
"use server";
import { auth } from "@/auth";
import { DocumentId, Form_SearchHistoryTemplate, SearchHistoryTemplate, SearchHistoryType } from "@nowcrm/services";
import { handleError, searchHistoryTemplatesService, StandardResponse } from "@nowcrm/services/server";

export async function updateSearchHistoryTemplate(
	id: DocumentId,
	{
		name,
		type,
		filters,
		query,
	}: Partial<Form_SearchHistoryTemplate>,
): Promise<StandardResponse<SearchHistoryTemplate>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await searchHistoryTemplatesService.update(id, {
			...(name ? { name } : {}),
			...(type ? { type: type as SearchHistoryType } : {}),
			...(filters ? { filters } : {}),
			...(query ? { query } : {}),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

// actions/search_history/updateSearch.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import searchHistoryTemplateService from "@/lib/services/new_type/searchHistoryTemplate.service";
import type { SearchHistoryType } from "@/lib/types/new_type/searchHistory";

export async function updateSearchTemplate(
	id: number,
	{
		name,
		type,
		filters,
		query,
	}: { name?: string; type?: string; filters?: string; query?: string },
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await searchHistoryTemplateService.update(id, {
			...(name ? { name } : {}),
			...(type ? { type: type as SearchHistoryType } : {}),
			...(filters ? { filters } : {}),
			...(query ? { query } : {}),
		});
		return res;
	} catch (error) {
		console.error("Error updating search history:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

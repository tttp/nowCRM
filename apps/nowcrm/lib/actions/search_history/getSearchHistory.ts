// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import searchHistoryTemplateService from "@/lib/services/new_type/searchHistoryTemplate.service";
import type { SearchHistoryType } from "@/lib/types/new_type/searchHistory";
import type { SearchHistoryTemplate } from "@/lib/types/new_type/searchHistoryTemplate";

export async function getSearchHistory(
	type: SearchHistoryType,
): Promise<StandardResponse<SearchHistoryTemplate[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await searchHistoryTemplateService.find({
			sort: ["id:desc"],
			filters: { type: { $eq: type } },
			pagination: { page: 1, pageSize: 10 },
		});
		return res as any;
	} catch (error) {
		console.error("Error adding to search history:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

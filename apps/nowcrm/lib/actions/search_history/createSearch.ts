// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import searchHistoryTemplateService from "@/lib/services/new_type/searchHistoryTemplate.service";
import type { SearchHistoryType } from "@/lib/types/new_type/searchHistory";
import type { SearchHistoryTemplate } from "@/lib/types/new_type/searchHistoryTemplate";

export async function createSearch(
	name: string,
	type: SearchHistoryType,
	filters: string,
	query: string,
): Promise<StandardResponse<SearchHistoryTemplate>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await searchHistoryTemplateService.create({
			name,
			type,
			filters,
			query,
			publishedAt: new Date(),
		});
		return res;
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

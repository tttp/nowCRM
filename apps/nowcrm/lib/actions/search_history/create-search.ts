// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { SearchHistoryTemplate, SearchHistoryType } from "@nowcrm/services";
import { handleError, searchHistoryTemplatesService, StandardResponse } from "@nowcrm/services/server";

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
		const res = await searchHistoryTemplatesService.create({
			name,
			type,
			filters,
			query,
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

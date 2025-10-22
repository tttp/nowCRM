"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import searchHistoryTemplateService from "@/lib/services/new_type/searchHistoryTemplate.service";

export async function makeFavorite(
	id: number,
	favorite: boolean,
): Promise<StandardResponse<any>> {
	const session = await auth();
	if (!session) return { data: null, status: 403, success: false };

	try {
		const res = await searchHistoryTemplateService.update(id, {
			favorite,
		});
		return res;
	} catch (error) {
		console.error("Error updating favorite status:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

"use server";

import surveyItemsService from "@/lib/services/new_type/surveyItems.service";
import type { SurveyItem } from "@/lib/types/new_type/survey_item";

export async function getSurveyItemsBySurveyId(
	id: number,
): Promise<SurveyItem[] | null> {
	const filters = {
		survey: { id: { $eq: id } },
	};

	const response = await surveyItemsService.find({
		populate: ["survey", "file"],
		sort: ["id:desc"],
		pagination: {
			page: 1,
			pageSize: 100,
		},
		filters,
	});

	// Since response.data is an array, return the first contact if available.
	if (Array.isArray(response.data) && response.data.length > 0) {
		return response.data;
	}

	return null;
}

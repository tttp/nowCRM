"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import surveyItemsService from "@/lib/services/new_type/surveyItems.service";
import type {
	Form_SurveyItem,
	SurveyItem,
} from "@/lib/types/new_type/survey_item";

export async function createSurveyItem(
	values: Pick<Form_SurveyItem, "question" | "answer" | "survey">,
): Promise<StandardResponse<SurveyItem>> {
	const session = await auth();

	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await surveyItemsService.create({
			...values,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating survey item:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

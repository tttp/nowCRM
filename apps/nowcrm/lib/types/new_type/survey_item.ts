import type { StrapiImageFormat } from "@/lib/services/new_type/assets/asset";
import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";
import type { Survey } from "./survey";

// Filters - json which used for strapi filters for entity for coresponding type
export interface SurveyItem extends Omit<BaseType, "name"> {
	question: string;
	answer: string;
	survey: Omit<Survey, "survey_items">;
	contact: Contact;
	file?: StrapiImageFormat;
	videoask_option_id?: string;
	videoask_question_id?: string;
}

export interface Form_SurveyItem extends Omit<BaseFormType, "name"> {
	question?: string;
	answer?: string;
	survey?: number;
	contact?: number;
	videoask_option_id?: string;
	videoask_question_id?: string;
}

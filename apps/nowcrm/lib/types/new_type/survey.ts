import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Contact } from "./contact";
import type { SurveyItem } from "./survey_item";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Survey extends BaseType {
	form_id: string;
	contact: Contact;
	survey_items: SurveyItem[];
}

export interface Form_Survey extends BaseFormType {
	form_id: string;
	contact: number;
	survey_items: StrapiConnect;
}

import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { Contact } from "./contact";
import type { SurveyItem } from "./survey-item";
export interface Survey extends BaseType {
	form_id: string;
	contact: Contact;
	survey_items: SurveyItem[];
}

export interface Form_Survey extends BaseFormType {
	form_id: string;
	contact: DocumentId;
	survey_items: StrapiConnect;
}

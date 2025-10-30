import type Asset from "./common/asset";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Survey } from "./survey";
export interface SurveyItem extends Omit<BaseType, "name"> {
	question: string;
	answer: string;
	file: Asset;
	survey: Survey;
}

export interface Form_SurveyItem extends Omit<BaseFormType, "name"> {
	question: string;
	answer: string;
	file: Asset;
	survey: DocumentId;
}

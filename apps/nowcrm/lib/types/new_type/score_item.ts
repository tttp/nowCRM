import type { BaseFormType, BaseType } from "../common/base_type";
import type { Action } from "./action";

// Filters - json which used for strapi filters for entity for coresponding type
export interface ScoreItem extends BaseType {
	name: string;
	value: number;
	action: Action;
}

export interface Form_ScoreItem extends BaseFormType {
	name: string;
	value: number;
	action: number;
}

import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Rank extends BaseType {
	name: string;
}

export interface Form_Rank extends BaseFormType {
	name: string;
}

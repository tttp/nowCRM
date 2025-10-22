import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Identity extends BaseType {
	email?: string;
}

export interface Form_Identity extends BaseFormType {
	email?: string;
}

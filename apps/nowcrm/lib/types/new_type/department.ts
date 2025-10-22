import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Department extends BaseType {
	name: string;
}

export interface Form_Department extends BaseFormType {
	name: string;
}

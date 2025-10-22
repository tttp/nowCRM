import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Tag extends BaseType {
	name: string;
	color: string;
}

export interface Form_Tag extends BaseFormType {
	name: string;
	color: string;
}

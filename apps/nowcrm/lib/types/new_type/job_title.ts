import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface JobTitle extends BaseType {
	name: string;
}

export interface Form_JobTitle extends BaseFormType {
	name: string;
}

import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface ContactType extends BaseType {
	name: string;
	description?: string;
}

export interface Form_ContactType extends BaseFormType {
	name: string;
}

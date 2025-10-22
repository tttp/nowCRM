import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface ContactSalutation extends BaseType {
	name: string;
}

export interface Form_ContactSalutation extends BaseFormType {
	name: string;
}

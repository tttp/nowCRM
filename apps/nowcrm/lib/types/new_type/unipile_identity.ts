import type { BaseFormType, BaseType } from "../common/base_type";

// Filters - json which used for strapi filters for entity for coresponding type
export interface UnipileIdentity extends BaseType {
	name: string;
	status: string;
	account_id: string;
}

export interface Form_UnipileIdentity extends BaseFormType {
	name: string;
	status: string;
	account_id: string;
}

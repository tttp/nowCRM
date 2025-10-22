import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Contact } from "./contact";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Keyword extends BaseType {
	name: string;
	contacts?: Contact[];
}

export interface Form_Keyword extends BaseFormType {
	name: string;
	contacts?: StrapiConnect;
}

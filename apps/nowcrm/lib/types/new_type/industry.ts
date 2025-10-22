import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Contact } from "./contact";
import type { Organization } from "./organization";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Industry extends BaseType {
	name: string;
	contacts?: Contact[];
	organizations?: Organization[];
}

export interface Form_Industry extends BaseFormType {
	name: string;
	contacts?: StrapiConnect;
	organizations?: StrapiConnect;
}

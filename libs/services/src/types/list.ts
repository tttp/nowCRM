import type { BaseFormType, BaseType } from "./common/base_type";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { Contact } from "./contact";
import type { Tag } from "./tag";
export interface List extends BaseType {
	contacts: Contact[];
	tags: Tag[];
}

export interface Form_List extends BaseFormType {
	contacts: StrapiConnect;
	tags: StrapiConnect;
}

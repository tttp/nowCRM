import type Asset from "@/lib/services/new_type/assets/asset";
import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Contact } from "./contact";

export interface Documents extends BaseType {
	file: Asset;
	contacts: Omit<Contact, "documents">[];
}

export interface Form_Documents extends BaseFormType {
	contacts: StrapiConnect;
}

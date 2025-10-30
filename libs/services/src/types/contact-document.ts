import type Asset from "./common/asset";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Contact } from "./contact";
export interface ContactDocument extends BaseType {
	file: Asset;
	contact: Contact;
}

export interface Form_ContactDocument extends BaseFormType {
	file: Asset;
	contact: DocumentId;
}

import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Contact } from "./contact";
export interface Contact_Note extends BaseType {
	text: string;
	contact: Contact;
}

export interface Form_Contact_Note extends BaseFormType {
	text: string;
	contact: DocumentId;
}

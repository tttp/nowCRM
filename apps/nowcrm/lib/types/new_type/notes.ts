import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";

export interface Note extends BaseType {
	name: string;
	text: string;
	contact: Contact;
}

export interface Form_Note extends BaseFormType {
	name: string;
	text: string;
	contact: number;
}

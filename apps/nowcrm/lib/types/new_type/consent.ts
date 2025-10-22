// contactsapp/lib/types/new_type/consent.ts

import type { BaseFormType, BaseType } from "../common/base_type";

export interface Consent extends Omit<BaseType, "name"> {
	version?: string;
	title?: string;
	active?: boolean;
	text?: string;
}

export interface Form_Consent extends Omit<BaseFormType, "name"> {
	version?: string;
	title?: string;
	active?: boolean;
	text?: string;
}

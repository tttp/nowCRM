//contactsapp/lib/types/new_type/TextBlock.ts

import type { BaseFormType, BaseType } from "../common/base_type";

export interface TextBlock extends BaseType {
	locale: string;
	text: string;
}

export interface Form_TextBlock extends BaseFormType {
	locale: string;
	text: string;
}

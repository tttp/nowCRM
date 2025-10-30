import type { BaseFormType, BaseType } from "./common/base_type";
export interface UnipileIdentity extends BaseType {
	unipile_status: string;
	account_id: string;
}

export interface Form_UnipileIdentity extends BaseFormType {
	unipile_status: string;
	account_id: string;
}

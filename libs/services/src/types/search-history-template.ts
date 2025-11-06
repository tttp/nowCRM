import type { BaseFormType, BaseType } from "./common/base_type";

export type SearchHistoryType = "contacts" | "organizations";

export interface SearchHistoryTemplate extends BaseType {
	type: SearchHistoryType;
	filters: object  | string;
	query: object | string;
	favorite: boolean;
}

export interface Form_SearchHistoryTemplate extends BaseFormType {
	type: SearchHistoryType;
	filters: object | string;
	query: object | string;
	favorite: boolean;
}

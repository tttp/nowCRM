import type { BaseFormType, BaseType } from "../common/base_type";

export type SearchHistoryType = "contacts" | "organizations";

// Filters - json which used for strapi filters for entity for coresponding type
export interface SearchHistory extends BaseType {
	type: SearchHistoryType;
	filters: string;
	query: string;
}

export interface Form_SearchHistory extends BaseFormType {
	type: SearchHistoryType;
	filters: string;
	query: string;
}

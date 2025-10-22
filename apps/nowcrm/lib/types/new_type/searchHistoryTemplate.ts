import type { BaseFormType, BaseType } from "../common/base_type";
import type { SearchHistoryType } from "./searchHistory";

// Filters - json which used for strapi filters for entity for coresponding type
export interface SearchHistoryTemplate extends BaseType {
	name: string;
	type: SearchHistoryType;
	filters: string;
	query: string;
	favorite: boolean;
}

export interface Form_SearchHistoryTemplate extends BaseFormType {
	name: string;
	type: SearchHistoryType;
	filters: string;
	query: string;
	favorite?: boolean;
}

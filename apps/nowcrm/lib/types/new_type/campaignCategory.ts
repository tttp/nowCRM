import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Campaign } from "./campaign";

export interface CampaignCategory extends BaseType {
	name: string;
	description?: string;
	campaigns?: Campaign[];
}

export interface Form_CampaignCategory extends BaseFormType {
	name: string;
	description?: string;
	campaigns?: StrapiConnect;
}

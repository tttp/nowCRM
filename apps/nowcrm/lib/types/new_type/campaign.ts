import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Action } from "./action";
import type { CampaignCategory } from "./campaignCategory";
import type { Composition } from "./composition";
import type { DonationTransaction } from "./donation_transaction";
import type { Journey } from "./journey";

export interface Campaign extends BaseType {
	name: string;
	description?: string;
	campaign_category?: CampaignCategory;
	donation_transactions?: DonationTransaction[];
	compositions?: Composition[];
	journeys?: Journey[];
	actions?: Action[];
}

export interface Form_Campaign extends BaseFormType {
	name: string;
	description?: string;
	campaign_category?: StrapiConnect;
	donation_transactions?: StrapiConnect;
	compositions?: StrapiConnect;
	journeys?: StrapiConnect;
	actions?: StrapiConnect;
}

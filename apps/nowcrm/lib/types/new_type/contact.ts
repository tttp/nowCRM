import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Action } from "./action";
import type { ContactInterest } from "./contact_interests";
import type { ContactSalutation } from "./contact_salutation";
import type { ContactTitle } from "./contact_title";
import type { ContactType } from "./contact_type";
import type { Department } from "./department";
import type { DonationTransaction } from "./donation_transaction";
import type { Industry } from "./industry";
import type { JobTitle } from "./job_title";
import type { Journey } from "./journey";
import type { JourneyStep } from "./journeyStep";
import type { Keyword } from "./keyword";
import type { List } from "./list";
import type { Note } from "./notes";
import type { Organization } from "./organization";
import type { Rank } from "./rank";
import type { Source } from "./source";
import type { Subscription } from "./subscription";
import type { SurveyItem } from "./survey_item";
import type { Tag } from "./tag";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Contact extends Omit<BaseType, "name"> {
	title?: ContactTitle;
	email: string;
	first_name: string;
	last_name: string;
	address_line1: string;
	address_line2: string;
	plz: string;
	zip: number;
	location: string;
	canton: string;
	country?: string;
	last_access?: any;
	language: string;
	function: string;
	phone: string;
	mobile_phone: string;
	salutation?: ContactSalutation;
	gender: string;
	website_url?: string;
	linkedin_url?: string;
	facebook_url?: string;
	twitter_url?: string;
	// channels?: Channel
	birth_date: Date;
	notes: Note[];
	organization?: Organization;
	journeys: Journey[];
	journey_steps: JourneyStep[];
	department?: Department;
	contact_types: ContactType[];
	// publications: Array<any>
	lists: List[];
	keywords: Keyword[];
	tags: Tag[];
	//documents: document[]
	actions: Action[];
	ranks: Rank[];
	sources: Source[];
	subscriptions: Subscription[];
	contact_interests: ContactInterest[];
	//extra_fields: extrafield[]
	survey_items: SurveyItem[];
	status:
		| "new"
		| "closed"
		| "contacted"
		| "negotiating"
		| "registered"
		| "backfill"
		| "prospect/marketing"
		| "customer/no marketing";
	priority: "p1" | "p2" | "p3" | "p4" | "p5";
	industry?: Industry;
	description?: string;
	donation_transactions: DonationTransaction[];
	unsubscribe_token?: string;
	job_description?: string;
	duration_role?: string;
	connection_degree?: string;
	job_title?: JobTitle;
}

export interface Form_Contact extends Omit<BaseFormType, "name"> {
	title?: number;
	email?: string;
	first_name: string;
	last_name?: string;
	address_line1?: string;
	address_line2?: string;
	plz?: string;
	zip?: number;
	location?: string;
	canton?: string;
	country?: string;
	last_access?: any;
	language: string;
	function?: string;
	phone?: string;
	mobile_phone?: string;
	salutation?: number;
	gender?: string;
	website_url?: string;
	linkedin_url?: string;
	facebook_url?: string;
	twitter_url?: string;
	// channels?: Channel
	birth_date?: Date;
	notes?: StrapiConnect;
	organization?: number;
	journeys?: StrapiConnect;
	journey_steps?: StrapiConnect;
	department?: number;
	contact_types?: StrapiConnect;
	// publications?: Array<any>
	tags?: StrapiConnect;
	lists?: StrapiConnect;
	keywords?: StrapiConnect;
	//documents?: document[]
	actions?: StrapiConnect;
	ranks?: StrapiConnect;
	sources?: StrapiConnect;
	subscriptions?: StrapiConnect;
	contact_interests?: StrapiConnect;
	//extra_fields?: extrafield[]
	status?:
		| "new"
		| "closed"
		| "contacted"
		| "negotiating"
		| "registered"
		| "backfill";
	priority?: "p1" | "p2" | "p3" | "p4" | "p5";
	industry?: number;
	donation_transactions?: StrapiConnect;
	description?: string;
	unsubscribe_token?: string;
	job_description?: string;
	duration_role?: string;
	connection_degree?: string;
	job_title?: number;
}

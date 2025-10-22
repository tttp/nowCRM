import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";

// Filters - json which used for strapi filters for entity for coresponding type
export interface DonationSubscription extends Omit<BaseType, "name"> {
	contact: Contact;
	payment_method?: string;
	currency?: string;
	amount?: number;
	payment_provider?: string;
	interval?: string;
	subscripiton_token?: string;
	raw_data?: string;
}

export interface Form_DonationSubscription extends Omit<BaseFormType, "name"> {
	contact: number;
	payment_method?: string;
	currency?: string;
	amount?: number;
	payment_provider?: string;
	interval?: string;
	subscripiton_token?: string;
	raw_data?: string;
}

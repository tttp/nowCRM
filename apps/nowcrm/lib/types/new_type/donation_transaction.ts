import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";

// Filters - json which used for strapi filters for entity for coresponding type
export interface DonationTransaction extends Omit<BaseType, "name"> {
	contact: Contact;
	card_holder_name: string;
	amount?: number;
	payment_method?: string;
	payment_provider?: string;
	user_ip?: string;
	status?: string;
	currency?: string;
	user_agent?: string;
	epp_transaction_id?: string;
	raw_data?: string;
	campaign_id?: string;
	campaign_name?: string;
	purpose?: string;
}

export interface Form_DonationTransaction extends Omit<BaseFormType, "name"> {
	contact: number;
	card_holder_name: string;
	amount?: number;
	payment_method?: string;
	payment_provider?: string;
	user_ip?: string;
	status?: string;
	currency?: string;
	user_agent?: string;
	epp_transaction_id?: string;
	raw_data?: string;
	campaign_id?: string;
	campaing_name?: string;
	purpose?: string;
}

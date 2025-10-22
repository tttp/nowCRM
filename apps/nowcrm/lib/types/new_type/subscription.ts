import type { BaseFormType, BaseType } from "../common/base_type";
import type { Channel } from "./channel";
import type { Consent } from "./consent";
import type { Contact } from "./contact";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Subscription extends Omit<BaseType, "name"> {
	channel: Channel;
	contact: Contact;
	subscribed_at: string;
	unsubscribed_at?: string;
	active: boolean;
	consent: Consent;
}

export interface Form_Subscription extends Omit<BaseFormType, "name"> {
	channel: number;
	contact?: number;
	subscribed_at: Date;
	unsubscribed_at?: string;
	active: boolean;
	consent?: number;
}

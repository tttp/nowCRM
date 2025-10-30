import type { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Consent } from "./consent";
import type { Contact } from "./contact";
import type { SubscriptionType } from "./subscription-type";
export interface Subscription extends Omit<BaseType, "name"> {
	active: boolean;
	contact: Contact;
	channel: Channel;
	subscription_type: SubscriptionType;
	subscribed_at: Date;
	unsubscribed_at: Date;
	unsubscribe_token: string;
	consent: Consent;
	period: number;
}

export interface Form_Subscription extends Omit<BaseFormType, "name"> {
	active: boolean;
	contact: DocumentId;
	channel: DocumentId;
	subscription_type: DocumentId;
	subscribed_at: Date;
	unsubscribed_at: Date;
	unsubscribe_token: string;
	consent: DocumentId;
	period: number;
}

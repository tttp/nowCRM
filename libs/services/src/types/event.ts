import type { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Composition } from "./composition";
import type { CompositionItem } from "./composition-item";
import type { Contact } from "./contact";
export interface Event extends Omit<BaseType, "name"> {
	action: string;
	contact: Contact;
	payload: string;
	source: string;
	external_id: string;
	event_status: string;
	destination: string;
	pinpoint_campaign_id: string;
	composition: Composition;
	title: string;
	channel: Channel;
	step_id: string;
	composition_item: CompositionItem;
}

export interface Form_Event extends Omit<BaseFormType, "name"> {
	action: string;
	contact: DocumentId;
	payload: string;
	source: string;
	external_id: string;
	event_status: string;
	destination: string;
	pinpoint_campaign_id: string;
	composition: DocumentId;
	title: string;
	channel: DocumentId;
	step_id: string;
	composition_item: DocumentId;
}

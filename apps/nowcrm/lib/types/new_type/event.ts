import type { BaseFormType, BaseType } from "../common/base_type";
import type { Channel } from "./channel";
import type { Composition, CompositionItem } from "./composition";
import type { Contact } from "./contact";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Event extends BaseType {
	action: string;
	payload: string;
	source: string;
	external_id: string;
	status: string;
	destination: string;
	pinpoint_campaign_id: string;
	composition: Composition;
	composition_item?: CompositionItem;
	contact: Contact;
	title: string;
	click_count: number;
	open_count: number;
	channel: Channel;
	step_id: string;
}

export interface Form_Event extends BaseFormType {
	action: string;
	payload: string;
	source: string;
	external_id: string;
	status: string;
	destination: string;
	pinpoint_campaign_id: string;
	composition: number;
	composition_item?: number;
	contact: number;
	title: string;
	channel: number;
	step_id: string;
}

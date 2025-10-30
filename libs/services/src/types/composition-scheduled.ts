import { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { Option } from "./common/option";
import { Composition } from "./composition";

export type CompositionScheduledStatuses = "scheduled" | "processing" | "published";

export interface CompositionScheduled extends BaseType {
    publish_date: Date;
    description: string;
    color: string;
    scheduled_status: CompositionScheduledStatuses;
    /**
     * send_to handle different sending types.
     * It can be or string -> means this will be signle contact email
     * It can be object with label + value
     * also it handles `identity` if its needed forthat channel
     */
    send_to?: {
		type: "contact" | "list" | "organization";
		send_data?: Option | string;
		identity?: Option;
	};
    channel: Channel;
    composition: Composition;
}

export interface Form_CompositionScheduled extends BaseFormType {
    publish_date: Date;
    description: string;
    color: string;
    scheduled_status: CompositionScheduledStatuses;
    /**
     * send_to handle different sending types.
     * It can be or string -> means this will be signle contact email
     * It can be object with label + value
     * also it handles `identity` if its needed forthat channel
     */
    send_to?: {
		type: "contact" | "list" | "organization";
		send_data?: Option | string;
		identity?: Option;
	};
    channel: DocumentId;
    composition: DocumentId;
}

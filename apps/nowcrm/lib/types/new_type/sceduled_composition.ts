import type { Option } from "@/components/autoComplete/autoComplete";
import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Channel } from "./channel";
import type { Composition } from "./composition";

export interface ScheduledComposition extends BaseType {
	status: string;
	publish_date: Date;
	composition: Composition;
	name: string;
	description: string;
	color: string;
	channel: Channel;
	send_to?: {
		type: "contact" | "list" | "organization";
		send_data?: Option | string;
		identity?: Option;
	};
}

export interface Form_ScheduledComposition extends BaseFormType {
	publish_date?: Date;
	status?: string;
	composition?: StrapiConnect;
	name: string;
	description?: string;
	color?: string;
	channel?: StrapiConnect;
	send_to?: {
		type: "contact" | "list" | "organization";
		send_data?: Option | string;
		identity?: Option;
	};
}

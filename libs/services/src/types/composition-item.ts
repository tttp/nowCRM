import type { Channel } from "./channel";
import type Asset from "./common/asset";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Option } from "./common/option";
import type { Composition } from "./composition";

export type CompositionItemsStatusKeys =
	| "Published"
	| "Not published"
	| "Scheduled"
	| "None";

export const compositionItemsStatuses: Option[] = [
	{ label: "Published", value: "Published" },
	{ label: "Not published", value: "Not published" },
	{ label: "Scheduled", value: "Scheduled" },
	{ label: "None", value: "None" },
];

export interface CompositionItem extends Omit<BaseType, "name"> {
	additional_prompt: string;
	result: string;
	attached_files: Asset[];
	item_status: CompositionItemsStatusKeys;
	composition: Composition;
	channel: Channel;
}

export interface Form_CompositionItem extends Omit<BaseFormType, "name"> {
	additional_prompt: string;
	result: string;
	attached_files?: Asset[];
	item_status: CompositionItemsStatusKeys;
	composition?: DocumentId;
	channel?: DocumentId;
}

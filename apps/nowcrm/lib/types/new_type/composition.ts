import type { ReactElement } from "react";
import type Asset from "@/lib/services/new_type/assets/asset";
import type { CompositionModelKeys } from "@/lib/static/compoisitonModels";
import type {
	CompositionItemsStatusKeys,
	CompositionStatusKeys,
} from "@/lib/static/compositionStatuses";
import type { LanguageKeys } from "@/lib/static/languages";
import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Channel } from "./channel";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Composition extends BaseType {
	subject: string;

	category: string;
	language: LanguageKeys;
	persona: string;
	status: CompositionStatusKeys;
	model: CompositionModelKeys;
	add_unsubscribe: boolean;

	reference_prompt?: string;
	reference_result?: string;
	composition_items: CompositionItem[];
}

export interface CompositionItem extends Omit<BaseType, "name"> {
	channel: Channel;
	composition: Composition;

	additional_prompt: string;
	result: string;

	status: CompositionItemsStatusKeys;
	attached_files?: Asset[];

	publication_date?: Date;
}

export interface Form_Composition extends BaseFormType {
	subject?: string;
	category?: string;
	language?: LanguageKeys;
	persona?: string;
	status: CompositionStatusKeys;
	reference_prompt?: string;
	reference_result?: string;
	add_unsubscribe?: boolean;
	composition_items?: StrapiConnect[];
}

export interface createAdditionalComposition {
	model: "gpt-4o-mini" | "claude";
	reference_result: string;
	additional_prompt?: string;
	removeHtml: boolean;
	max_content_length?: number;
}

export interface Form_CompositionItem extends Omit<BaseFormType, "name"> {
	channel: number;
	composition: number;

	additional_prompt?: string;
	result?: string;

	attached_files?: StrapiConnect;

	status?: CompositionItemsStatusKeys;
	publication_date?: Date;
}

export interface ReferenceComposition {
	title?: string;
	subject?: string;
	language?: LanguageKeys;
	mainChannel?: number;
	category?: string;
	promptBase?: string;
	persona?: string;
	model: "gpt-4o-mini" | "claude";
	prompt: string;
}

export interface QuickWriteModel {
	model: string;
	title: string;
	language?: LanguageKeys | string;
	style?: string;
	additional_context?: string;
	target_length?: string;
	persona?: string;
}

export interface StructuredResponseModel {
	model: string;
	input_data: string;
	structure_scheme: string;
	language?: LanguageKeys | string;
}
export interface createComposition {
	name: string;
	category?: string;
	language?: LanguageKeys;
	mainChannel: number;
	persona?: string;
	status?: CompositionStatusKeys;
	model: CompositionModelKeys;
	reference_prompt?: string;
	reference_result?: string;
	add_unsubscribe: boolean;
	composition_items?: {
		additional_prompt: string;
		channel: number;
	}[];
}

type StrapiImageFormat = {
	ext: string;
	url: string;
	hash: string;
	name: string;
	path: string | null;
	height: number;
	width: number;
	size: number;
};

export type StrapiImage = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	height: number;
	width: number;
	url: string;
	ext: string;
	size: number;
	name: string;
	hash: string;
	formats: {
		large: StrapiImageFormat;
		medium: StrapiImageFormat;
		small: StrapiImageFormat;
		thumbnail: StrapiImageFormat;
	};
};

export type ReferenceResponse = {
	success: boolean;
	content: string | null;
	error?: string;
};

export type AIResponse = {
	success: boolean;
	text: string;
	error?: string;
};

export interface FailedContact {
	email: string;
	reason: string;
}

export interface JobCompositionRecord {
	id: string;
	name?: string;
	title: string;
	createdAt: string;
	channels?: string[];
	status: string;
	logs: string;
	progressPercent?: number;
	jobId: string;
	type?: string;
	massAction?: string | null;
	listName?: string | null;
	listField?: string | null;
	parsedSearchMask?: string;
	result?: string;
	composition_id?: number;
	from?: string;
	to?: number[];
	subject?: string;
	publicationDate?: string | null;
}

export interface FailedOrg {
	name: string;
	reason: string;
}

export type DateRange =
	| "today"
	| "yesterday"
	| "last7days"
	| "custom"
	| "total";

export interface MetricConfig {
	label: string;
	actionTypes: string | string[];
	mode: "count" | "percentage" | "fraction";
	denominatorActionTypes?: string | string[];
	threshold?: number;
	invert?: boolean;
	Icon: ReactElement;
	bgColor: string;
	fgColor: string;
	textColor: string;
}

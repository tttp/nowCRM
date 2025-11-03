import type { aiModelKeys } from "static/ai-models";
import type { LanguageKeys } from "static/languages";
import type { Campaign } from "./campaign";
import type { BaseFormType, BaseType } from "./common/base_type";
import type { Option } from "./common/option";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { CompositionItem } from "./composition-item";

export type CompositionStatusKeys = "Finished" | "Pending" | "Errored";

export const compositionStatuses: Option[] = [
	{ label: "Finished", value: "Finished" },
	{ label: "Pending", value: "Pending" },
	{ label: "Errored", value: "Errored" },
];

export interface Composition extends BaseType {
	composition_status: CompositionStatusKeys;
	category: string;
	language: LanguageKeys;
	persona: string;
	reference_prompt: string;
	reference_result: string;
	add_unsubscribe: boolean;
	model: aiModelKeys;
	subject: string;
	composition_items: CompositionItem[];
	campaign: Campaign[];
}

export interface Form_Composition extends BaseFormType {
	composition_status: CompositionStatusKeys;
	category: string;
	language: LanguageKeys;
	persona: string;
	reference_prompt: string;
	reference_result: string;
	add_unsubscribe: boolean;
	model: aiModelKeys;
	subject: string;
	composition_items?: StrapiConnect;
	campaign?: StrapiConnect;
}

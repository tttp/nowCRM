import { LanguageKeys } from "static/languages";
import type { BaseFormType, BaseType } from "./common/base_type";
import { aiModelKeys } from "static/ai-models";
import { CompositionItem } from "./composition-item";
import { Campaign } from "./campaign";
import { StrapiConnect } from "./common/StrapiQuery";
import { Option } from "./common/option";

export type CompositionStatusKeys = "Finished" | "Pending" | "Errored";

export const compositionStatuses: Option[] = [
	{ label: "Finished", value: "Finished" },
	{ label: "Pending", value: "Pending" },
	{ label: "Errored", value: "Errored" },
];

export interface Composition extends BaseType {
    composition_status: CompositionStatusKeys
    category: string;
    language: LanguageKeys;
    persona: string;
    reference_prompt: string;
    reference_result: string;
    add_unsubscribe: string;
    model: aiModelKeys;
    subject: string;
    composition_items: CompositionItem[]
    campaign: Campaign[]
}

export interface Form_Composition extends BaseFormType {
    composition_status: CompositionStatusKeys
    category: string;
    language: LanguageKeys;
    persona: string;
    reference_prompt: string;
    reference_result: string;
    add_unsubscribe: string;
    model: aiModelKeys;
    subject: string;
    composition_items: StrapiConnect
    campaign: StrapiConnect
}

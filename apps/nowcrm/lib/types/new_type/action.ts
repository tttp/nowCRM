import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { ActionType } from "./action_type";
import type { Contact } from "./contact";
import type { JourneyStep } from "./journeyStep";
import type { ScoreItem } from "./score_item";

export interface Action extends BaseType {
	entity: string;
	payload: string;
	value: string;
	source: string;
	score: number;
	score_items: ScoreItem[];
	journey_step: JourneyStep;
	external_id: string;
	effort: string;
	partnership: string;
	action_normalized_type: ActionType;
	contact: Contact;
}

export interface Form_Action extends BaseFormType {
	action_type: string;
	entity: string;
	payload: string;
	value: string;
	source: string;
	score: number;
	score_items: StrapiConnect;
	journey_step: number;
	external_id: string;
	effort: string;
	partnership: string;
	action_normalized_type: number;
	contact: number;
}

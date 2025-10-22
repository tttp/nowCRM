import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Channel } from "./channel";
import type { Composition } from "./composition";
import type { Contact } from "./contact";
import type { Identity } from "./identity";
import type { Journey } from "./journey";
import type { JourneyPassedStep } from "./journeyPassedStep";
import type { JourneyStepConnection } from "./journeyStepConnection";

export type timingJourneyStepKeys = "delay" | "publish" | "none";

export interface journeyTiming {
	type: timingJourneyStepKeys;
	value: number | Date; //date for cases when key is publish || number for cases when its delay
}

export interface journeyAdditionalData {
	enabled?: boolean;
	entity?: string;
	attribute?: string;
	event?: string;
}

// Filters - json which used for strapi filters for entity for coresponding type
export interface JourneyStep extends BaseType {
	journey: Journey;
	contacts?: Contact[];
	composition?: Composition;
	channel?: Channel;
	connections_to_this_step?: JourneyStepConnection[]; // connections which handles rules to go on this step
	connections_from_this_step?: JourneyStepConnection[]; // connections which handle rules to go into the next step

	identity: Identity;
	timing?: journeyTiming;
	journey_passed_steps?: JourneyPassedStep[];
	type?: string;
	additional_data?: journeyAdditionalData;
}

export interface Form_JourneyStep extends BaseFormType {
	journey: number;
	contacts?: StrapiConnect;
	composition?: number;
	channel?: number;
	source_rules?: StrapiConnect;
	target_rules?: StrapiConnect;

	identity?: number;
	timing?: journeyTiming;
	journey_passed_steps?: number;
	additional_data?: string;
}

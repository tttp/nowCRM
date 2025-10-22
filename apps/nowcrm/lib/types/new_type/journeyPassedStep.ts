import type { BaseFormType, BaseType } from "../common/base_type";
import type { Channel } from "./channel";
import type { Composition } from "./composition";
import type { Contact } from "./contact";
import type { Journey } from "./journey";
import type { JourneyStep } from "./journeyStep";

// Filters - json which used for strapi filters for entity for coresponding type
export interface JourneyPassedStep extends Omit<BaseType, "name"> {
	journey: Journey;
	contact: Contact;
	composition: Composition;
	journey_step: JourneyStep;
	channel: Channel;
}

export interface Form_JourneyPassedStep extends Omit<BaseFormType, "name"> {
	journey: number;
	contact: number;
	composition: number;
	journey_step: number;
	channel: number;
}

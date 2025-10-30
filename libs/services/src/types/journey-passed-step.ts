import type { Channel } from "./channel";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Composition } from "./composition";
import type { Contact } from "./contact";
import type { Journey } from "./journey";
import type { JourneyStep } from "./journey-step";
export interface JourneyPassedStep extends Omit<BaseType, "name"> {
	contact: Contact;
	journey: Journey;
	journey_step: JourneyStep;
	composition: Composition;
	channel: Channel;
}

export interface Form_JourneyPassedStep extends Omit<BaseFormType, "name"> {
	contact: DocumentId;
	journey: DocumentId;
	journey_step: DocumentId;
	composition: DocumentId;
	channel: DocumentId;
}

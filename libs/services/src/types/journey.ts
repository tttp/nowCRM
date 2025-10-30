import type { Campaign } from "./campaign";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { Contact } from "./contact";
import type { JourneyPassedStep } from "./journey-passed-step";
import type { JourneyStep } from "./journey-step";
export interface Journey extends BaseType {
	campaign: Campaign;
	contacts: Contact[];
	flow: object;
	active: boolean;
	journey_passed_steps: JourneyPassedStep[];
	journey_steps: JourneyStep[];
}

export interface Form_Journey extends BaseFormType {
	campaign: DocumentId;
	contacts: StrapiConnect;
	flow: object;
	active: boolean;
	journey_passed_steps: StrapiConnect;
	journey_steps: StrapiConnect;
}

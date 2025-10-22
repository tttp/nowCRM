import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { Contact } from "./contact";
import type { JourneyPassedStep } from "./journeyPassedStep";
import type { JourneyStep } from "./journeyStep";
// Filters - json which used for strapi filters for entity for coresponding type
export interface Journey extends BaseType {
	journey_steps: JourneyStep[];
	contacts?: Contact[];
	flow: string;
	active: boolean;
	journey_passed_steps: JourneyPassedStep[];
}

export interface Form_Journey extends BaseFormType {
	journey_steps?: StrapiConnect;
	contacts?: StrapiConnect;
	flow: string;
	active: boolean;
	journey_passed_steps?: number;
}

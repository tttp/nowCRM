import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { JourneyStep } from "./journeyStep";
import type { JourneyStepRule } from "./journeyStepRule";

// Filters - json which used for strapi filters for entity for coresponding type
export interface JourneyStepConnection extends BaseType {
	source_step: JourneyStep;
	target_step: JourneyStep;
	priority: number;

	condition_type: "all" | "any";

	journey_step_rules: JourneyStepRule[];
}

export interface Form_JourneyStepConnection extends Omit<BaseFormType, "name"> {
	source_step: number;
	target_Step: number;
	priority: number;

	condition_type: "all" | "any";

	journey_step_rules?: StrapiConnect;
}

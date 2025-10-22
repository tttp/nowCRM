import type { BaseFormType, BaseType } from "../common/base_type";
import type { JourneyStepRule } from "./journeyStepRule";

// Filters - json which used for strapi filters for entity for coresponding type
export interface JourneyStepRuleScore extends BaseType {
	value: string;
	journey_step_rule: JourneyStepRule;
}

export interface Form_JourneyStepRuleScore extends BaseFormType {
	value: string;
	journey_step_rule: number;
}

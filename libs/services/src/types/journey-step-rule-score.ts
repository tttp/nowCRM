import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { JourneyStepRule } from "./journey-step-rule";
export interface JourneyStepRuleScore extends BaseType {
	value: string;
	journey_step_rule: JourneyStepRule;
}

export interface Form_JourneyStepRuleScore extends BaseFormType {
	value: string;
	journey_step_rule: DocumentId;
}

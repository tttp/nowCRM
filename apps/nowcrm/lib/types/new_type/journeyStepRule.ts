import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";
import type { JourneyStepConnection } from "./journeyStepConnection";
import type { JourneyStepRuleScore } from "./journeyStepRuleScore";

// Filters - json which used for strapi filters for entity for coresponding type
export interface JourneyStepRule extends Omit<BaseType, "name"> {
	condition: string; // here we await different condition cases
	conditon_entity?: string; // here we have entity to which relate strapi
	condition_operator: string; // here operator to apply on value
	condition_value: string; // here value which we accept to be for condition
	label: string;
	ready_condition: string;
	additional_condition: string;
	additional_data: string; // json which handle some additional data for example datas for prefiling async select

	journey_step_connection: JourneyStepConnection;
	journey_step_rule_scores: JourneyStepRuleScore[];
}

export interface Form_JourneyStepRule extends Omit<BaseFormType, "name"> {
	condition: string; // here we await different condition cases
	conditon_entity?: string; // here we have entity to which relate strapi
	condition_operator: string; // here operator to apply on value
	condition_value: string; // here value which we accept to be for condition
	label: string;
	ready_condition?: string;
	additional_condition?: string;
	additional_data?: string; // json which handle some additional data for example datas for prefiling async select

	journey_step_connection: number;
	journey_step_rule_scores?: StrapiConnect;
}

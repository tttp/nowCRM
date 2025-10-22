import APIRoutes from "../../http/apiRoutes";
import type {
	Form_JourneyStepRule,
	JourneyStepRule,
} from "../../types/new_type/journeyStepRule";
import BaseService from "../common/base.service";

class JourneyStepRuleService extends BaseService<
	JourneyStepRule,
	Form_JourneyStepRule
> {
	public constructor() {
		super(APIRoutes.JOURNEY_RULES);
	}
}
export const journeyStepRuleService = new JourneyStepRuleService();

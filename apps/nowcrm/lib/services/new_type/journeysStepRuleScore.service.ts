import APIRoutes from "../../http/apiRoutes";
import type {
	Form_JourneyStepRuleScore,
	JourneyStepRuleScore,
} from "../../types/new_type/journeyStepRuleScore";
import BaseService from "../common/base.service";

class JourneyStepRuleScoresService extends BaseService<
	JourneyStepRuleScore,
	Form_JourneyStepRuleScore
> {
	public constructor() {
		super(APIRoutes.JOURNEYS_STEP_RULE_SCORE);
	}
}
export const journeyStepRuleScoresService = new JourneyStepRuleScoresService();

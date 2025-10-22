import APIRoutes from "../../http/apiRoutes";
import type {
	Form_JourneyStepConnection,
	JourneyStepConnection,
} from "../../types/new_type/journeyStepConnection";
import BaseService from "../common/base.service";

class JourneyStepConnectionsService extends BaseService<
	JourneyStepConnection,
	Form_JourneyStepConnection
> {
	public constructor() {
		super(APIRoutes.JOURNEY_STEP_CONNECTIONS);
	}
}
export const journeyStepConnectionsService =
	new JourneyStepConnectionsService();

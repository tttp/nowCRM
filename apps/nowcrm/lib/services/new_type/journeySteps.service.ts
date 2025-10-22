import type {
	Form_JourneyStep,
	JourneyStep,
} from "@/lib/types/new_type/journeyStep";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class JourneyStepsService extends BaseService<JourneyStep, Form_JourneyStep> {
	private static instance: JourneyStepsService;

	private constructor() {
		super(APIRoutes.JOURNEY_STEPS);
	}

	/**
	 * Retrieves the singleton instance of JourneyStepsService.
	 * @returns {JourneyStepsService} - The singleton instance.
	 */
	public static getInstance(): JourneyStepsService {
		if (!JourneyStepsService.instance) {
			JourneyStepsService.instance = new JourneyStepsService();
		}
		return JourneyStepsService.instance;
	}
}

const journeyStepsService = JourneyStepsService.getInstance();
export default journeyStepsService;

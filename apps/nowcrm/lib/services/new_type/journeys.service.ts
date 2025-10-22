import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { Form_Journey, Journey } from "@/lib/types/new_type/journey";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import type { StandardResponse } from "../common/response.service";
import { journeyStepConnectionsService } from "./journeyStepConnections.service";
import journeyStepsService from "./journeySteps.service";

class JourneysService extends BaseService<Journey, Form_Journey> {
	private static instance: JourneysService;

	private constructor() {
		super(APIRoutes.JOURNEYS);
	}

	/**
	 * Retrieves the singleton instance of JourneysService.
	 * @returns {JourneysService} - The singleton instance.
	 */
	public static getInstance(): JourneysService {
		if (!JourneysService.instance) {
			JourneysService.instance = new JourneysService();
		}
		return JourneysService.instance;
	}

	/**
	 * Duplicates a journey by its ID.
	 * @param {number} journeyId - The ID of the journey to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - A promise that resolves to the response object.
	 */
	async duplicate(journeyId: number): Promise<StandardResponse<null>> {
		const session = await auth();
		if (!session) {
			console.log("No session found");
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.JOURNEYS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: journeyId }),
			});

			const result = await response.json();

			return {
				data: result.responseObject ?? null,
				status: result.status ?? 200,
				success: result.success ?? true,
				errorMessage: result.message,
			};
		} catch (_error: any) {
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "error",
			};
		}
	}

	/**
	 * Duplicates a journey by its ID.
	 * @param {number} journeyId - The ID of the journey to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - A promise that resolves to the response object.
	 */
	async fullDelete(journeyId: number): Promise<StandardResponse<null>> {
		const session = await auth();
		if (!session) {
			console.log("No session found");
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const steps = await journeyStepsService.findAll({
				filters: {
					journey: { id: { $eq: journeyId } },
				},
			});
			steps.data?.map(async (item) => {
				await journeyStepsService.delete(item.id);
			});
			const connections = await journeyStepConnectionsService.findAll({
				filters: {
					target_step: {
						journey: { id: { $eq: journeyId } },
					},
				},
			});
			connections.data?.map(async (item) => {
				await journeyStepConnectionsService.delete(item.id);
			});
			await journeysService.delete(journeyId);

			return {
				data: null,
				status: 200,
				success: true,
			};
		} catch (_error: any) {
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "error",
			};
		}
	}
}

const journeysService = JourneysService.getInstance();
export default journeysService;

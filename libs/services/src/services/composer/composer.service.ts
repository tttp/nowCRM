import { API_ROUTES_COMPOSER } from "../../api-routes/api-routes-composer";
import { envServices } from "../../envConfig";
import { DocumentId } from "../../types/common/base_type";
import { composerSendType } from "../../types/composer/composer-send-types";
import { Contact } from "../../types/contact";
import { JourneyStep } from "../../types/journey-step";
import { ServiceResponse } from "../../types/microservices/service-response";
import {  StandardResponse } from "../common/response.service";
import { journeyStepsService } from "../journey-steps.service";

class ComposerService {


	async sendCompositionByFilters(
		filters: Record<string, any>,
		compositionId: DocumentId,
		channelNames: string[],
		subject: string,
		from: string,
		interval: number,
	): Promise<StandardResponse<any>> {
		try {
			const payload = {
				composition_id: compositionId,
				entity: "contacts",
				searchMask: filters,
				type: "contact",
				channels: channelNames.map((c) => c.toLowerCase()),
				subject,
				from,
				interval,
			};

			console.log(
				">>> Send composition by filters payload:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
                //send to channels hadnle both standard and mass actions
				`${envServices.COMPOSER_URL}${API_ROUTES_COMPOSER.SEND_TO_CHANNELS}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			const raw = await res.text();
			if (!res.ok) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Server returned ${res.status}: ${raw}`,
				};
			}

			const contentType = res.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Unexpected content-type: ${contentType}, body: ${raw}`,
				};
			}

			const data = JSON.parse(raw);
			return { data, status: res.status, success: true };
		} catch (error: any) {
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: error.message,
			};
		}
	}

    async sendComposition(
		token: string,
		step: JourneyStep,
		contact: Contact,
		type: composerSendType,
		ignoreSubscription?: boolean,
	): Promise<StandardResponse<null>> {
		let passed_step = false;
		if (!step.composition) {
			return {
				errorMessage: "Step is missing composition",
				data: null,
				status: 400,
				success: false,
			};
		}

		const payload = {
			composition_id: step.composition.id,
			channels: [step.channel?.name.toLowerCase()],
			to: contact.email,
			type: type,
			subject: step.composition.subject || step.composition.name,
			from: step.identity.name,
			ignoreSubscription,
		};

		passed_step = (
			await journeyStepsService.checkPassedStep(
				token,
				step.id,
				contact.id,
				step.composition.id,
			)
		).data as boolean;

		if (!passed_step) {
			const base = envServices.COMPOSER_URL;
			const url = new URL(API_ROUTES_COMPOSER.SEND_TO_CHANNELS, base);

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					accept: "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = (await response.json()) as ServiceResponse<null>;

			if (!data.success) {
				return {
					errorMessage: `Failed to send composition:${data.message} - ${data.statusCode}`,
					data: null,
					status: data.statusCode,
					success: false,
				};
			}

			return {
				data: null,
				status: data.statusCode,
				success: true,
			};
		}

		return {
			data: null,
			status: 200,
			success: true,
		};
	}
}

export const composerService = new ComposerService();

import type { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/server";
import type { SNSMessage } from "./snsWebhookModel";
import { snsWebhookServiceApi } from "./snsWebhookService";

class SNSWebhookController {
	public handleSNSWebhook: RequestHandler = async (
		req: Request,
		res: Response,
	) => {
		try {
			logger.info("SNS Webhook received");

			const wrapper: any = Array.isArray(req.body) ? req.body[0] : req.body;
			let snsMessage: SNSMessage;

			if (typeof wrapper.body === "string") {
				try {
					snsMessage = JSON.parse(wrapper.body);
				} catch (parseError) {
					logger.error(`Failed to parse SNS message: ${parseError}`);
					throw new Error(`Invalid SNS message format`);
				}
			} else {
				snsMessage = wrapper as SNSMessage;
			}

			logger.info(`Processing SNS message of type: ${snsMessage.Type}`);

			const serviceResponse =
				await snsWebhookServiceApi.processSNSMessage(snsMessage);

			if (!serviceResponse.success) {
				logger.error(
					`SNS message processing failed: ${serviceResponse.message}`,
				);
			}

			handleServiceResponse(serviceResponse, res);
		} catch (error: any) {
			logger.error(`SNS Webhook Error: ${error.message}`);
			res.status(400).json({
				success: false,
				message: "Failed to process SNS webhook",
				error: error.message,
			});
		} finally {
			if (!res.headersSent) {
				res.sendStatus(200);
			}
		}
	};
}

export const snsWebhookController = new SNSWebhookController();

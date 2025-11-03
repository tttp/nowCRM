import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { snsWebhookController } from "./snsWebhookController";
import { SNSMessageSchema } from "./snsWebhookModel";

export const snsWebhookRegistry = new OpenAPIRegistry();
export const snsWebhookRouter: Router = express.Router();

// Register the SNS message schema
snsWebhookRegistry.register("SNSMessage", SNSMessageSchema);

snsWebhookRegistry.registerPath({
	method: "post",
	path: "/webhook/ses-event-to-strapi",
	tags: ["Webhooks"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: SNSMessageSchema,
				},
			},
		},
	},
	responses: createApiResponse(
		z.object({
			message: z.string(),
		}),
		"Success",
		200,
	),
});

// Update the route handler to match the path
snsWebhookRouter
	.route("/ses-event-to-strapi")
	.post((req, res, next) => {
		try {
			return snsWebhookController.handleSNSWebhook(req, res, next);
		} catch (error: any) {
			console.error("SNS Webhook Error:", error);
			res.status(500).send({ error: error.message });
		}
	})
	.all((req, res) => {
		res.status(405).json({
			success: false,
			message: `The requested webhook "${req.path.replace(/^\//, "")}" is not registered for ${req.method}, only for POST`,
		});
	});

snsWebhookRouter.post("/ses-event-to-strapi", (req, res, next) => {
	try {
		return snsWebhookController.handleSNSWebhook(req, res, next);
	} catch (error: any) {
		console.error("SNS Webhook Error:", error);
		res.status(500).send({ error: error.message });
	}
});

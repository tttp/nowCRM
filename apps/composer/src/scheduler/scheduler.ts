import type { CompositionScheduled } from "@nowcrm/services";
import { compositionScheduledsService } from "@nowcrm/services/server";
import amqp from "amqplib";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/logger";

const QUEUE_NAME = "delayed_composer_jobs";

async function sendToDelayedQueue(
	data: { fetchedAt: string; payload: CompositionScheduled },
	delayMs: number,
): Promise<void> {
	const connection = await amqp.connect(env.RABBITMQ_URL);
	const channel = await connection.createChannel();

	const delayedQueue = `${QUEUE_NAME}_delayed`;
	const exchange = `${QUEUE_NAME}_exchange`;

	await channel.assertQueue(QUEUE_NAME, { durable: true });
	await channel.assertExchange(exchange, "direct", { durable: true });

	await channel.assertQueue(delayedQueue, {
		durable: true,
		arguments: {
			"x-dead-letter-exchange": exchange,
			"x-dead-letter-routing-key": "delayed",
		},
	});

	await channel.bindQueue(QUEUE_NAME, exchange, "delayed");

	channel.sendToQueue(delayedQueue, Buffer.from(JSON.stringify(data)), {
		persistent: true,
		expiration: delayMs.toString(),
	});

	await channel.close();
	await connection.close();
}
async function runTask(): Promise<void> {
	try {
		const now = new Date();
		const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

		const response = await compositionScheduledsService.findAll(
			env.COMPOSER_STRAPI_API_TOKEN,
			{
				filters: {
					publish_date: {
						// @ts-expect-error
						$gte: now.toISOString(),
						$lte: tenMinutesLater.toISOString(),
					},
					status: {
						$eq: "scheduled", // avoid refetching processed items
					},
				},
				populate: ["channel", "composition"],
			},
		);

		if (!response.data || !response.success) {
			logger.error(`Cannot fetch data: ${response.errorMessage}`);
			return;
		}

		for (const composition of response.data) {
			const publishTime = new Date(composition.publish_date).getTime();
			const nowTime = Date.now();
			const delayMs = Math.max(publishTime - nowTime, 0);

			const job = {
				fetchedAt: new Date().toISOString(),
				payload: composition,
			};

			// Mark item as processing to avoid duplicate scheduling
			await compositionScheduledsService.update(
				composition.documentId,
				{ scheduled_status: "processing" },
				env.COMPOSER_STRAPI_API_TOKEN,
			);

			// Send to delayed queue
			await sendToDelayedQueue(job, delayMs);
		}
	} catch (error) {
		console.error("[Scheduler] Error fetching or sending job:", error);
	}
}

/**
 * Start the cron scheduler
 */

export function startScheduler(): void {
	console.log("[Scheduler] Running every 5 minutes...");
	setInterval(runTask, 5 * 60 * 1000); // 5 minutes
}

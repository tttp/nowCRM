import type { CompositionScheduled, UnipileIdentity } from "@nowcrm/services";
import {
	compositionScheduledsService,
	identitiesService,
	unipileIdentitiesService,
} from "@nowcrm/services/server";
import amqp from "amqplib";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/logger";

const QUEUE_NAME = "delayed_composer_jobs";

async function processJob(job: {
	fetchedAt: string;
	payload: CompositionScheduled;
}): Promise<void> {
	const identity = job.payload.send_to?.identity;
	let identity_mail: string | undefined;
	let identity_unipile: UnipileIdentity | undefined | null;
	if (identity) {
		if (job.payload.channel.name !== "Linkedin_Invitations") {
			identity_mail = (
				await identitiesService.findOne(
					identity.value,
					env.COMPOSER_STRAPI_API_TOKEN,
				)
			).data?.name;
		} else {
			identity_unipile = (
				await unipileIdentitiesService.findOne(
					identity.value,
					env.COMPOSER_STRAPI_API_TOKEN,
				)
			).data;
		}
	}
	const send_data = job.payload.send_to
		? job.payload.send_to.send_data
		: undefined;
	let send_to: string | number | undefined;
	if (send_data) {
		send_to =
			typeof send_data === "object" ? parseInt(send_data.value, 10) : send_data;
	}
	const url = env.isProduction
		? `https://${env.COMPOSER_HOST}.${env.CUSTOMER_DOMAIN}/send-to-channels`
		: `http://${env.COMPOSER_HOST}:${env.COMPOSER_PORT}/send-to-channels`;
	const data = {
		composition_id: job.payload.composition.id,
		subject: job.payload.composition.subject,
		channels: [job.payload.channel.name.toLowerCase()],
		to: send_to,
		type: job.payload.send_to ? job.payload.send_to.type : undefined,
		from: identity_mail,
		//handling linkedin case
		account: identity_unipile,
	};
	await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
		body: JSON.stringify(data),
	});
	await compositionScheduledsService.update(
		job.payload.documentId,
		{ scheduled_status: "published" },
		env.COMPOSER_STRAPI_API_TOKEN,
	);
	return;
}

export async function startConsumer(): Promise<void> {
	const connection = await amqp.connect(env.RABBITMQ_URL);
	const channel = await connection.createChannel();
	await channel.assertQueue(QUEUE_NAME, { durable: true });

	console.log(`[Consumer] Waiting for jobs in "${QUEUE_NAME}"...`);

	channel.consume(
		QUEUE_NAME,
		async (msg) => {
			if (!msg) return;
			try {
				const job: any = JSON.parse(msg.content.toString());
				logger.info(`[Consumer] Received job`, job);
				await processJob(job);
				channel.ack(msg);
			} catch (err) {
				console.error("[Consumer] Job error:", err);
				channel.nack(msg, false, false);
			}
		},
		{ noAck: false },
	);
}

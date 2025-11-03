import { Worker } from "bullmq";
import {
	fetchContactsFromList,
	fetchContactsFromOrganization,
} from "@/api/sendToChannels/channelFunctions/utils/channelProcessor";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import { sendQueue } from "../queues/SendQueue";

new Worker(
	"massSendQueue",
	async (job) => {
		const { data, composition } = job.data as {
			data: {
				to?: any;
				channels: string[];
				type?: string;
				interval?: number;
				[key: string]: any;
			};
			composition: any;
		};
		const { to, channels, type } = data;

		logger.info(
			`massSendWorker started. Type: "${type}", Contacts: ${Array.isArray(to) ? to.length : 0}, Channels: ${channels.join(", ")}`,
		);

		if (type === "list" || type === "organization") {
			try {
				const contactsRes =
					type === "list"
						? await fetchContactsFromList(to as number)
						: await fetchContactsFromOrganization(to as number);

				if (!contactsRes.success || !contactsRes.responseObject) {
					logger.error(`Failed to fetch contacts for ${type} ${to}`);
					return;
				}

				const contacts = contactsRes.responseObject;

				if (contacts.length === 0) {
					logger.warn(`No contacts found in ${type} ${to}`);
					return;
				}

				for (const contact of contacts) {
					const contactData = { ...data, to: contact.id, type: "contact" };
					for (const channel of channels) {
						await sendQueue.add("send", {
							channel,
							data: contactData,
							composition,
							parentJobId: job.id,
						});
						logger.info(
							`Job enqueued for ${type}=${to}: channel="${channel}", contactId=${contact.id}`,
						);
					}
				}

				logger.info(
					`massSendWorker finished: enqueued ${contacts.length * channels.length} jobs for ${type} ${to}`,
				);
			} catch (err) {
				logger.error(
					`Error in massSendWorker for ${type} ${to}: ${(err as Error).message}`,
				);
			}
			return;
		}

		if (!data.type) {
			for (const channel of channels) {
				await sendQueue.add("send", {
					channel,
					data,
					composition,
					parentJobId: job.id,
				});
				logger.info(
					`Job enqueued directly for channel="${channel}", parentJobId=${job.id}`,
				);
			}
			return;
		}

		if (!Array.isArray(to) || to.length === 0) {
			logger.warn("No contacts received into massSendWorker");
			return;
		}

		for (const [index, contact] of to.entries()) {
			const contactData = { ...data, to: [contact] };
			for (const channel of channels) {
				await sendQueue.add("send", {
					channel,
					data: contactData,
					composition,
					parentJobId: job.id,
				});
				logger.info(
					`Job sent to sendQueue: contact #${index + 1}, channel="${channel}"`,
				);
			}
		}

		logger.info(`massSendWorker finished. Total: ${to.length} contacts`);
	},
	{
		connection: {
			host: env.COMPOSER_REDIS_HOST,
			port: env.COMPOSER_REDIS_PORT,
		},
	},
);

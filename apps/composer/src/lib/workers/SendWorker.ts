import { CommunicationChannel, type Composition } from "@nowcrm/services";
import { Queue, Worker } from "bullmq";
import { processEmailChannel } from "@/api/sendToChannels/channelFunctions/email/processEmail";
import { linkedinPost } from "@/api/sendToChannels/channelFunctions/linkedIn/createPost";
import { processSMSChannel } from "@/api/sendToChannels/channelFunctions/sms/processSMS";
import { telegramPost } from "@/api/sendToChannels/channelFunctions/telegram/createPost";
import { twitterPost } from "@/api/sendToChannels/channelFunctions/twitter/createPost";
import { processLinkedInInvitationsChannel } from "@/api/sendToChannels/channelFunctions/unipile/processLinkedinInvitations";
import { sleep } from "@/api/sendToChannels/channelFunctions/utils/sleep";
import { processWhatsAppChannel } from "@/api/sendToChannels/channelFunctions/whatsapp/processWhatsapp";
import { wordpressPost } from "@/api/sendToChannels/channelFunctions/wordpress/createPost";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

const massSendQueue = new Queue("massSendQueue", {
	connection: {
		host: env.COMPOSER_REDIS_HOST,
		port: env.COMPOSER_REDIS_PORT,
	},
});

new Worker(
	"sendQueue",
	async (job) => {
		const { channel, data, composition, parentJobId } = job.data as {
			channel: string;
			data: any & { to?: any[]; interval?: number };
			composition: Composition;
			parentJobId?: string;
		};

		try {
			logger.info(
				`Send worker processing channel="${channel}", interval=${data.interval}, parentJobId=${parentJobId}`,
			);

			switch (channel) {
				case CommunicationChannel.EMAIL.toLowerCase(): {
					const res = await processEmailChannel(data, composition);
					if (!res.success && parentJobId) {
						const parent = await massSendQueue.getJob(parentJobId);
						if (parent) {
							await parent.log(
								`Failed sending to ${JSON.stringify(data.to)}: ${res.message}`,
							);
							logger.info(`Appended error to parent job ${parentJobId} log`);
						}
					}
					if (data.interval) await sleep(data.interval);
					break;
				}

				case CommunicationChannel.WHATSAPP.toLowerCase(): {
					const res = await processWhatsAppChannel(data, composition);
					if (!res.success && parentJobId) {
						const parent = await massSendQueue.getJob(parentJobId);
						if (parent) {
							await parent.log(
								`Failed sending to ${JSON.stringify(data.to)}: ${res.message}}`,
							);
							logger.info(`Appended error to parent job ${parentJobId} log`);
						}
					}
					if (data.interval) await sleep(data.interval);
					break;
				}

				case CommunicationChannel.SMS.toLowerCase(): {
					const res = await processSMSChannel(data, composition);
					if (!res.success && parentJobId) {
						const parent = await massSendQueue.getJob(parentJobId);
						if (parent) {
							await parent.log(
								`Failed sending to ${JSON.stringify(data.to)}: ${res.message}}`,
							);
							logger.info(`Appended error to parent job ${parentJobId} log`);
						}
					}
					if (data.interval) await sleep(data.interval);
					break;
				}

				case CommunicationChannel.TELEGRAM.toLowerCase(): {
					const item = composition.composition_items.find(
						(item) =>
							item.channel.name.toLowerCase() ===
							CommunicationChannel.TELEGRAM.toLowerCase(),
					);
					if (item) await telegramPost(item);
					break;
				}

				case CommunicationChannel.TWITTER.toLowerCase(): {
					const item = composition.composition_items.find(
						(item) =>
							item.channel.name.toLowerCase() ===
							CommunicationChannel.TWITTER.toLowerCase(),
					);
					if (item) await twitterPost(item);
					break;
				}

				case CommunicationChannel.LINKEDIN.toLowerCase(): {
					const item = composition.composition_items.find(
						(item) =>
							item.channel.name.toLowerCase() ===
							CommunicationChannel.LINKEDIN.toLowerCase(),
					);
					if (item) await linkedinPost(item);
					break;
				}

				case CommunicationChannel.LINKEDIN_INVTITATIONS.toLowerCase(): {
					const res = await processLinkedInInvitationsChannel(
						data,
						composition,
					);
					if (!res.success && parentJobId) {
						const parent = await massSendQueue.getJob(parentJobId);
						if (parent) {
							await parent.log(
								`Failed sending to ${JSON.stringify(data.to)}: ${res.message} ${new Date().toISOString()}`,
							);
							logger.info(`Appended error to parent job ${parentJobId} log`);
						}
					}
					if (data.interval) await sleep(data.interval);
					break;
				}

				case CommunicationChannel.BLOG.toLowerCase(): {
					const item = composition.composition_items.find(
						(item) =>
							item.channel.name.toLowerCase() ===
							CommunicationChannel.BLOG.toLowerCase(),
					);
					if (item && data.subject) {
						await wordpressPost(item, data.subject);
					}
					break;
				}

				default:
					logger.warn(`Unknown channel in worker: ${channel}`);
			}
		} catch (error: any) {
			const msg = error.message ?? String(error);
			logger.error(`Error processing channel ${channel}: ${msg}`);
			if (parentJobId) {
				const parent = await massSendQueue.getJob(parentJobId);
				if (parent) {
					await parent.log(
						`Error ${channel} to ${JSON.stringify(data.to)}: ${msg}}`,
					);
					logger.info(`Appended error to parent job ${parentJobId} log`);
				}
			}
		}
	},
	{
		connection: {
			host: env.COMPOSER_REDIS_HOST,
			port: env.COMPOSER_REDIS_PORT,
		},
	},
);

import { Queue } from "bullmq";
import { env } from "@/common/utils/envConfig";

//Queue for sending emails
export const sendQueue = new Queue("sendQueue", {
	connection: {
		host: env.COMPOSER_REDIS_HOST,
		port: env.COMPOSER_REDIS_PORT,
	},
});

//Queue for sending task
export const massSendQueue = new Queue("massSendQueue", {
	connection: {
		host: env.COMPOSER_REDIS_HOST,
		port: env.COMPOSER_REDIS_PORT,
	},
});

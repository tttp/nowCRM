import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/dist/src/queueAdapters/bullMQ.js";
import { ExpressAdapter } from "@bull-board/express";
import { massSendQueue, sendQueue } from "@/lib/queues/SendQueue";


export const serverAdapter: ExpressAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

export const bullBoard = createBullBoard({
	queues: [new BullMQAdapter(sendQueue), new BullMQAdapter(massSendQueue)],
	serverAdapter,
});

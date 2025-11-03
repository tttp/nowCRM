// queueModel.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const QueueDataQuerySchema = z.object({
	activeQueue: z.string().openapi({ example: "massSendQueue" }),
	status: z.string().default("latest").openapi({ example: "latest" }),
	page: z.string().optional().openapi({ example: "1" }),
	jobsPerPage: z.string().optional().openapi({ example: "10" }),
});

export const QueueJobSchema = z.object({
	id: z.string(),
	filename: z.string(),
	createdAt: z.string(),
	type: z.string().nullable().optional(),
	channel: z.string().optional(),
	compositionId: z.number().optional(),
	subject: z.string().optional(),
	from: z.string().optional(),
	recipients: z.array(z.number()).optional(),
	compositionName: z.string().optional(),
	compositionStatus: z.string().optional(),
	language: z.string().optional(),
	persona: z.string().optional(),
	logs: z.array(z.string()),
});

export type QueueJob = z.infer<typeof QueueJobSchema>;

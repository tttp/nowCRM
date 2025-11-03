import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const sendToChannelsSchema = z.object({
	composition_id: z.number(),
	channels: z.string().array(),
	to: z
		.union([z.string(), z.array(z.string()), z.number(), z.array(z.number())])
		.optional(),
	type: z.enum(["list", "contact", "organization"]).optional(),
	from: z.string().optional(),
	subject: z.string().optional(),
	interval: z.number(),
});

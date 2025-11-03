import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Composer = z.infer<typeof ComposerReferenceSchema>;

export const ComposerReferenceSchema = z.object({
	model: z.enum(["gpt-4o-mini", "claude"]),
	prompt: z.string(),
});

export const ComposerRegenerateSchema = z.object({
	model: z.enum(["gpt-4o-mini", "claude"]),
	reference_result: z.string(),
	removeHtml: z.boolean(),
	max_content_length: z.number().optional(),
	additional_prompt: z.string(),
});

export const ComposerCreateSchema = z.object({
	name: z.string(),
	category: z.string().optional(),
	language: z.enum(["en", "it", "fr", "de"]),
	persona: z.string().optional(),
	reference_prompt: z.string().optional(),
	reference_result: z.string().optional(),
	// base_image: z.any().optional(),
	composition_items: z.array(
		z.object({
			additional_prompt: z.string().optional(),
			channel: z.number().optional(),
			//image: z.any().optional(),
		}),
	),
});

export const QuickWriteSchema = z.object({
	model: z.enum(["gpt-4o-mini", "claude"]),
	title: z.string(),
	style: z.string().optional(),
	language: z.string().optional(),
	additional_context: z.string().optional(),
	target_length: z.string().optional(),
});

export const StructuredResponseSchema = z.object({
	model: z.enum(["gpt-4o-mini", "claude"]),
	input_data: z.string(),
	structure_scheme: z.string(),
	language: z.string().optional(),
});

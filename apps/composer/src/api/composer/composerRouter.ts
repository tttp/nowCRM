import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { composerController } from "./composerController";
import {
	ComposerCreateSchema,
	ComposerReferenceSchema,
	ComposerRegenerateSchema,
	QuickWriteSchema,
	StructuredResponseSchema,
} from "./composerModel";

export const composerRegistry = new OpenAPIRegistry();
export const composerRouter: Router = express.Router();

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

composerRegistry.register(
	"ComposerCreateReferenceRequest",
	ComposerReferenceSchema,
);
composerRegistry.register("ComposerCreateRequest", ComposerCreateSchema);

composerRegistry.registerPath({
	method: "post",
	path: "/composer/create-composition",
	tags: ["Composer"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: ComposerCreateSchema,
				},
			},
		},
	},
	responses: createApiResponse(z.null(), "Success", 200),
});

composerRegistry.registerPath({
	method: "post",
	path: "/composer/create-reference",
	tags: ["Composer"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: ComposerReferenceSchema,
				},
			},
		},
	},
	responses: createApiResponse(z.null(), "Success", 200),
});

composerRegistry.registerPath({
	method: "post",
	path: "/composer/regenerate",
	tags: ["Composer"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: ComposerRegenerateSchema,
				},
			},
		},
	},
	responses: createApiResponse(z.null(), "Success", 200),
});

composerRegistry.register("ComposerQuickWriteRequest", QuickWriteSchema);

composerRegistry.registerPath({
	method: "post",
	path: "/composer/quick-write",
	tags: ["Composer"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: QuickWriteSchema,
				},
			},
		},
	},
	responses: createApiResponse(
		z.object({ result: z.string() }).nullable(),
		"Success",
		200,
	),
});

composerRegistry.register(
	"ComposerStructuredResponseRequest",
	StructuredResponseSchema,
);

composerRegistry.registerPath({
	method: "post",
	path: "/composer/structured-response",
	tags: ["Composer"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: StructuredResponseSchema,
				},
			},
		},
	},
	responses: createApiResponse(
		z.object({ result: z.string() }).nullable(),
		"Success",
		200,
	),
});

composerRouter.post("/create-reference", (req, res, next) => {
	try {
		return composerController.createReference(req, res, next);
	} catch (error) {
		console.log(error);
		res.status(400).send({ error: error });
	}
});

composerRouter.post("/create-composition", (req, res, next) => {
	try {
		return composerController.createComposition(req, res, next);
	} catch (error) {
		res.status(400).send({ error: error });
	}
});

composerRouter.post("/regenerate", (req, res, next) => {
	try {
		return composerController.regenerate(req, res, next);
	} catch (error) {
		res.status(400).send({ error: error });
	}
});

composerRouter.post("/quick-write", (req, res, next) => {
	try {
		return composerController.quickWrite(req, res, next);
	} catch (error) {
		res.status(400).send({ error: error });
	}
});

composerRouter.post("/structured-response", (req, res, next) => {
	try {
		return composerController.getStructuredResponse(req, res, next);
	} catch (error) {
		res.status(400).send({ error: error });
	}
});

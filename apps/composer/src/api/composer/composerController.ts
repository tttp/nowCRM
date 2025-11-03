import type {
	createAdditionalComposition,
	createComposition,
	QuickWriteModel,
	ReferenceComposition,
	structuredResponse,
} from "@nowcrm/services";
import type { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/logger";
import { composerServiceApi } from "./composerService";

class ComposerController {
	public createReference: RequestHandler = async (
		req: Request,
		res: Response,
	) => {
		const serviceResponse = await composerServiceApi.CreateReference(
			req.body as ReferenceComposition,
		);
		if (!serviceResponse.success) logger.error(serviceResponse);
		handleServiceResponse(serviceResponse, res);
	};

	public createComposition: RequestHandler = async (
		req: Request,
		res: Response,
	) => {
		const serviceResponse = await composerServiceApi.createComposition(
			req.body as createComposition,
		);
		if (!serviceResponse.success) logger.error(serviceResponse);
		handleServiceResponse(serviceResponse, res);
	};

	public regenerate: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await composerServiceApi.CreateAdditionalResult(
			req.body as createAdditionalComposition,
		);
		if (!serviceResponse.success) logger.error(serviceResponse);
		handleServiceResponse(serviceResponse, res);
	};

	public quickWrite: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await composerServiceApi.QuickGenerate(
			req.body as QuickWriteModel,
		);
		if (!serviceResponse.success) logger.error(serviceResponse);
		handleServiceResponse(serviceResponse, res);
	};

	public getStructuredResponse: RequestHandler = async (
		req: Request,
		res: Response,
	) => {
		const serviceResponse = await composerServiceApi.GetStructuredResponse(
			req.body as structuredResponse,
		);
		if (!serviceResponse.success) logger.error(serviceResponse);
		handleServiceResponse(serviceResponse, res);
	};
}

export const composerController = new ComposerController();

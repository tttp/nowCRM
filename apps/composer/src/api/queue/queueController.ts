// src/api/queue/queueController.ts
import type { NextFunction, Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/server";
import { queueServiceApi } from "./queueService";

class QueueController {
	public async getQueueData(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { activeQueue, status, page, jobsPerPage } = req.query as {
				activeQueue: string;
				status: string;
				page?: string;
				jobsPerPage?: string;
			};

			const serviceResponse = await queueServiceApi.getQueueData({
				activeQueue,
				status,
				page,
				jobsPerPage,
			});

			if (!serviceResponse.success) {
				logger.error(serviceResponse);
			}

			handleServiceResponse(serviceResponse, res);
		} catch (err) {
			next(err);
		}
	}
}

export const queueController = new QueueController();

"use server";

import { auth } from "@/auth";
import { CompositionScheduled, StrapiQuery } from "@nowcrm/services";
import { handleError, StandardResponse } from "@nowcrm/services/server";
import { compositionScheduledsService } from "@nowcrm/services/server";

export async function fetchScheduledCompositions(
	start?: string,
	end?: string,
): Promise<StandardResponse<CompositionScheduled[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: [],
			status: 403,
			success: false,
			errorMessage: "Unauthorized",
		};
	}

	try {
		const filters: StrapiQuery<CompositionScheduled> | undefined =
			start && end
				? ({
						filters: {
							publish_date: {
								$gte: start,
								$lte: end,
							},
						},
						populate: ["composition", "channel"],
					} as unknown as StrapiQuery<CompositionScheduled>)
				: undefined;

		const response = await compositionScheduledsService.find(session.jwt,filters);
		return response;
	} catch (error) {
		return handleError(error);
	}
}

"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import scheduledCompositionService from "@/lib/services/new_type/scheduledComposition.service";
import type StrapiQuery from "@/lib/types/common/StrapiQuery";
import type { ScheduledComposition } from "@/lib/types/new_type/sceduled_composition";

export async function fetchScheduledCompositions(
	start?: string,
	end?: string,
): Promise<StandardResponse<ScheduledComposition[]>> {
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
		const filters: StrapiQuery<ScheduledComposition> | undefined =
			start && end
				? ({
						filters: {
							publish_date: {
								$gte: start,
								$lte: end,
							},
						},
						populate: ["composition", "channel"],
					} as unknown as StrapiQuery<ScheduledComposition>)
				: undefined;

		const response = await scheduledCompositionService.find(filters);
		return response;
	} catch (error) {
		console.error("[fetchScheduledCompositions] Error:", error);
		return {
			data: [],
			status: 500,
			success: false,
			errorMessage: String(error),
		};
	}
}

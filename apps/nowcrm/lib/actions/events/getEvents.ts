// lib/actions/events/getEvents.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import eventsService from "@/lib/services/new_type/events.service";
import type { Event } from "@/lib/types/new_type/event";

export async function getEventsByCompositionId(
	compositionItemId: number,
	channelName?: string,
	page?: number,
	pageSize?: number,
	search?: string,
	actions?: string[],
): Promise<StandardResponse<Event[]>> {
	const session = await auth();
	if (!session) {
		return {
			success: false,
			status: 403,
			data: null,
			errorMessage: "Unauthorized",
		};
	}

	try {
		const resolvedPage = page ?? 1;
		const resolvedPageSize = typeof pageSize === "number" ? pageSize : -1;

		const filters: any = {
			composition_item: { id: { $eq: compositionItemId } },
			...(channelName ? { channel: { name: { $eq: channelName } } } : {}),
			...(search ? { action: { $containsi: search } } : {}),
		};

		if (actions && actions.length > 0) {
			filters.$or = actions.map((a) => ({
				action: { $eqi: a },
			}));
		}

		const query: any = {
			sort: ["id:desc"],
			filters,
			pagination: {
				page: resolvedPage,
				pageSize: resolvedPageSize,
			},
			populate: {
				contact: true,
			},
		};

		const res = await eventsService.find(query);
		return res;
	} catch (e) {
		console.error("Error fetching events:", e);
		return {
			success: false,
			status: 500,
			data: null,
			errorMessage: `${e}`,
		};
	}
}

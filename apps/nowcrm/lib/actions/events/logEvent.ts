// lib/actions/events/logUnsubscribeEvent.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import eventsService from "@/lib/services/new_type/events.service";
import type { Contact } from "@/lib/types/new_type/contact";
import type { Event, Form_Event } from "@/lib/types/new_type/event";

export async function logUnsubscribeEvent(
	contact: Contact,
	compositionId: number,
	channelId: number,
	payload?: any,
): Promise<StandardResponse<Event>> {
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
		const data: Partial<Form_Event> = {
			contact: contact.id,
			composition_item: compositionId,
			external_id: "",
			destination: contact.mobile_phone || contact.phone || "",
			status: "unsubscribed",
			action: "unsubscribe",
			source: "Unsubscribe",
			channel: channelId,
			payload: payload ? JSON.stringify(payload) : "",
			publishedAt: new Date(),
			title: "Unsubscribe event",
			name: "unsubscribe",
		};

		return await eventsService.create(data as Form_Event);
	} catch (e) {
		console.error("Error logging unsubscribe event:", e);
		return {
			success: false,
			status: 500,
			data: null,
			errorMessage: `${e}`,
		};
	}
}

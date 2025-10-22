// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import channelService from "@/lib/services/new_type/channel.service";
import composerItemService from "@/lib/services/new_type/composerItems.service";
import type { CompositionItem } from "@/lib/types/new_type/composition";

export async function createCompositionItem(
	composition_id: number,
	channel_name: string,
): Promise<StandardResponse<CompositionItem>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const channel = await channelService.find({
			filters: { name: { $eqi: channel_name } },
		});
		if (!channel.data || !channel.success) {
			console.error("Error creating composition: ");
			console.log(channel);
			return {
				data: null,
				status: 500,
				success: false,
			};
		}
		const res = await composerItemService.create({
			composition: composition_id,
			channel: channel.data[0].id,
			result: "-", // needed to avoid save errors
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

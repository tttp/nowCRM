// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import channelService from "@/lib/services/new_type/channel.service";
import type { Channel } from "@/lib/types/new_type/channel";

export async function getChannels(): Promise<StandardResponse<Channel[]>> {
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
			filters: { name: { $eqi: "email" } },
		});

		return channel;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

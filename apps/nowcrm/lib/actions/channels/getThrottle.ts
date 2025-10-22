// src/actions/getThrottleAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import channelService from "@/lib/services/new_type/channel.service";

export interface ChannelThrottleResponse {
	throttle: number;
	max_sending_quota: number;
	max_sending_rate: number;
}

export async function getChannelThrottle(
	channelName: string,
): Promise<StandardResponse<ChannelThrottleResponse>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "User is not authenticated",
		};
	}

	try {
		const res = await channelService.find(
			{
				filters: { name: { $eqi: channelName } },
				fields: ["throttle", "max_sending_quota", "max_sending_rate"],
			},
			/* isPublic = */ false,
		);

		if (!res.success) {
			return {
				data: null,
				status: res.status,
				success: false,
				errorMessage: res.errorMessage || "Failed to fetch channel",
			};
		}
		if (!res.data || res.data.length === 0) {
			return {
				data: null,
				status: 404,
				success: false,
				errorMessage: `Channel "${channelName}" not found`,
			};
		}

		const channel = res.data[0] as unknown as {
			throttle?: number;
			max_sending_quota?: number;
			max_sending_rate?: number;
			attributes?: {
				throttle?: number;
				max_sending_quota?: number;
				max_sending_rate?: number;
			};
		};

		const throttle = channel.throttle ?? channel.attributes?.throttle ?? 0;
		const maxSendingQuota =
			channel.max_sending_quota ?? channel.attributes?.max_sending_quota ?? 0;
		const maxSendingRate =
			channel.max_sending_rate ?? channel.attributes?.max_sending_rate ?? 0;

		return {
			data: {
				throttle,
				max_sending_quota: maxSendingQuota,
				max_sending_rate: maxSendingRate,
			},
			status: 200,
			success: true,
		};
	} catch (error: any) {
		console.error("Error in getChannelThrottle:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: String(error),
		};
	}
}

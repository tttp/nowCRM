import { CommunicationChannel, type Composition } from "@nowtec/shared";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import type { sendToChannelsData } from "@/lib/types/sendToChannel";
import { processChannel } from "../utils/channelProcessor";
import { LinkedInInvitation } from "./sendInvitation";
/**
 * Process SMS channel
 * @param data Channel data
 * @param composition Composition data
 * @returns ServiceResponse with success or failure
 */
export async function processLinkedInInvitationsChannel(
	data: sendToChannelsData,
	composition: Composition,
): Promise<ServiceResponse<boolean | null>> {
	const { account } = data;
	return processChannel(
		data,
		composition,
		CommunicationChannel.LINKEDIN_INVTITATIONS,
		LinkedInInvitation,
		"linkedin_url",
		[account],
	);
}

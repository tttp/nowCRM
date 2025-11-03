
import { ServiceResponse } from "@nowcrm/services";
import { processChannel } from "../utils/channelProcessor";
import { LinkedInInvitation } from "./sendInvitation";
import { CommunicationChannel, Composition, sendToChannelsData } from "@nowcrm/services";
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

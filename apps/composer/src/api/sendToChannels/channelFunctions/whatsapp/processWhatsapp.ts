
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { processChannel } from "../utils/channelProcessor";
import { whatsAppMessage } from "./sendWhatsAppMessage";
import { CommunicationChannel, Composition, sendToChannelsData } from "@nowcrm/services";

/**
 * Process whatsapp channel
 * @param data Channel data
 * @param composition Composition data
 * @returns ServiceResponse with success or failure
 */
export async function processWhatsAppChannel(
	data: sendToChannelsData,
	composition: Composition,
): Promise<ServiceResponse<boolean | null>> {
	return processChannel(
		data,
		composition,
		CommunicationChannel.WHATSAPP,
		whatsAppMessage,
		"mobile_phone",
	);
}

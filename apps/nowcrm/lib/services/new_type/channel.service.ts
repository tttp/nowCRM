import type { Channel, Form_Channel } from "@/lib/types/new_type/channel";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ChannelService extends BaseService<Channel, Form_Channel> {
	private static instance: ChannelService;

	private constructor() {
		super(APIRoutes.CHANNELS);
	}

	/**
	 * Retrieves the singleton instance of ChannelService.
	 * @returns {ChannelService} - The singleton instance.
	 */
	public static getInstance(): ChannelService {
		if (!ChannelService.instance) {
			ChannelService.instance = new ChannelService();
		}
		return ChannelService.instance;
	}
}

const channelService = ChannelService.getInstance();
export default channelService;

// src/services/contact.service.ts

import type {
	Form_MediaType,
	MediaType,
} from "@/lib/types/new_type/media_type";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class MediaTypeService extends BaseService<MediaType, Form_MediaType> {
	private static instance: MediaTypeService;

	private constructor() {
		super(APIRoutes.MEDIA_TYPES);
	}

	/**
	 * Retrieves the singleton instance of MediaTypeService.
	 * @returns {MediaTypeService} - The singleton instance.
	 */
	public static getInstance(): MediaTypeService {
		if (!MediaTypeService.instance) {
			MediaTypeService.instance = new MediaTypeService();
		}
		return MediaTypeService.instance;
	}
}

const mediaTypeService = MediaTypeService.getInstance();
export default mediaTypeService;

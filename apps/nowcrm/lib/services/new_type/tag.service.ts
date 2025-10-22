// src/services/contact.service.ts

import type { Form_Tag, Tag } from "@/lib/types/new_type/tag";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class TagService extends BaseService<Tag, Form_Tag> {
	private static instance: TagService;

	private constructor() {
		super(APIRoutes.TAGS);
	}

	/**
	 * Retrieves the singleton instance of tagService.
	 * @returns {tagService} - The singleton instance.
	 */
	public static getInstance(): TagService {
		if (!TagService.instance) {
			TagService.instance = new TagService();
		}
		return TagService.instance;
	}
}

const tagService = TagService.getInstance();
export default tagService;

// src/services/contact.service.ts

import type { Form_Keyword, Keyword } from "@/lib/types/new_type/keyword";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class KeywordService extends BaseService<Keyword, Form_Keyword> {
	private static instance: KeywordService;

	private constructor() {
		super(APIRoutes.KEYWORDS);
	}

	/**
	 * Retrieves the singleton instance of KeywordService.
	 * @returns {KeywordService} - The singleton instance.
	 */
	public static getInstance(): KeywordService {
		if (!KeywordService.instance) {
			KeywordService.instance = new KeywordService();
		}
		return KeywordService.instance;
	}
}

const keywordService = KeywordService.getInstance();
export default keywordService;

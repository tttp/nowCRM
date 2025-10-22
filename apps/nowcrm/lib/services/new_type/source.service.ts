// src/services/contact.service.ts

import APIRoutes from "../../http/apiRoutes";
import type { Form_Source, Source } from "../../types/new_type/source";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class SourceService extends BaseService<Source, Form_Source> {
	private static instance: SourceService;

	private constructor() {
		super(APIRoutes.SOURCES);
	}

	/**
	 * Retrieves the singleton instance of SourceService.
	 * @returns {SourceService} - The singleton instance.
	 */
	public static getInstance(): SourceService {
		if (!SourceService.instance) {
			SourceService.instance = new SourceService();
		}
		return SourceService.instance;
	}
}

const sourceService = SourceService.getInstance();
export default sourceService;

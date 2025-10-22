// src/services/crmversion.service.ts

import APIRoutes from "../../http/apiRoutes";
import type {
	CrmVersion,
	Form_CrmVersion,
} from "../../types/new_type/crmversion";
import BaseService from "../common/base.service";

/**
 * Service class to handle crmVersion API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class CrmVersionService extends BaseService<CrmVersion, Form_CrmVersion> {
	private static instance: CrmVersionService;

	private constructor() {
		super(APIRoutes.CRM_VERSION);
	}

	/**
	 * Retrieves the singleton instance of NoteService.
	 * @returns {NoteService} - The singleton instance.
	 */
	public static getInstance(): CrmVersionService {
		if (!CrmVersionService.instance) {
			CrmVersionService.instance = new CrmVersionService();
		}
		return CrmVersionService.instance;
	}
}

const noteService = CrmVersionService.getInstance();
export default noteService;

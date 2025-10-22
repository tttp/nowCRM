// contactsapp/lib/services/new_type/term.service.ts

import type { Form_Term, Term } from "@/lib/types/new_type/term";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Term-related API interactions.
 * Extends the generic BaseService with Term-specific types.
 */
class TermService extends BaseService<Term, Form_Term> {
	private static instance: TermService;

	private constructor() {
		super(APIRoutes.TERMS);
	}

	/**
	 * Retrieves the singleton instance of TermService.
	 * @returns {TermService} - The singleton instance.
	 */
	public static getInstance(): TermService {
		if (!TermService.instance) {
			TermService.instance = new TermService();
		}
		return TermService.instance;
	}
}

const termService = TermService.getInstance();
export default termService;

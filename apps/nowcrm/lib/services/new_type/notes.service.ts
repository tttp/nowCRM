// src/services/contact.service.ts

import APIRoutes from "../../http/apiRoutes";
import type { Form_Note, Note } from "../../types/new_type/notes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class NoteService extends BaseService<Note, Form_Note> {
	private static instance: NoteService;

	private constructor() {
		super(APIRoutes.NOTES);
	}

	/**
	 * Retrieves the singleton instance of NoteService.
	 * @returns {NoteService} - The singleton instance.
	 */
	public static getInstance(): NoteService {
		if (!NoteService.instance) {
			NoteService.instance = new NoteService();
		}
		return NoteService.instance;
	}
}

const noteService = NoteService.getInstance();
export default noteService;

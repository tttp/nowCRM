import type { Documents, Form_Documents } from "@/lib/types/new_type/document";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class DocumentsService extends BaseService<Documents, Form_Documents> {
	private static instance: DocumentsService;

	private constructor() {
		super(APIRoutes.DOCUMENTS);
	}

	/**
	 * Retrieves the singleton instance of DocumentsService.
	 * @returns {DocumentsService} - The singleton instance.
	 */
	public static getInstance(): DocumentsService {
		if (!DocumentsService.instance) {
			DocumentsService.instance = new DocumentsService();
		}
		return DocumentsService.instance;
	}
}

const documentsService = DocumentsService.getInstance();
export default documentsService;

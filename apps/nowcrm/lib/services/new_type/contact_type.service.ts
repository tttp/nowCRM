import type {
	ContactType,
	Form_ContactType,
} from "@/lib/types/new_type/contact_type";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ContactTypeService extends BaseService<ContactType, Form_ContactType> {
	private static instance: ContactTypeService;

	private constructor() {
		super(APIRoutes.CONTACT_TYPES);
	}

	/**
	 * Retrieves the singleton instance of ContactTypeService.
	 * @returns {ContactTypeService} - The singleton instance.
	 */
	public static getInstance(): ContactTypeService {
		if (!ContactTypeService.instance) {
			ContactTypeService.instance = new ContactTypeService();
		}
		return ContactTypeService.instance;
	}
}

const contactTypeService = ContactTypeService.getInstance();
export default contactTypeService;

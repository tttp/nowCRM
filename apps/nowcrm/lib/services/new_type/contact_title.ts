import type {
	ContactTitle,
	Form_ContactTitle,
} from "@/lib/types/new_type/contact_title";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ContactTitleService extends BaseService<ContactTitle, Form_ContactTitle> {
	private static instance: ContactTitleService;

	private constructor() {
		super(APIRoutes.CONTACT_TITLES);
	}

	/**
	 * Retrieves the singleton instance of ContactInterestsService.
	 * @returns {ContactInterestsService} - The singleton instance.
	 */
	public static getInstance(): ContactTitleService {
		if (!ContactTitleService.instance) {
			ContactTitleService.instance = new ContactTitleService();
		}
		return ContactTitleService.instance;
	}
}

const contactTitlesService = ContactTitleService.getInstance();
export default contactTitlesService;

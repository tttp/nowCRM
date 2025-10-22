import type {
	ContactInterest,
	Form_ContactInterest,
} from "@/lib/types/new_type/contact_interests";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ContactInterestsService extends BaseService<
	ContactInterest,
	Form_ContactInterest
> {
	private static instance: ContactInterestsService;

	private constructor() {
		super(APIRoutes.CONTACT_INTERESTS);
	}

	/**
	 * Retrieves the singleton instance of ContactInterestsService.
	 * @returns {ContactInterestsService} - The singleton instance.
	 */
	public static getInstance(): ContactInterestsService {
		if (!ContactInterestsService.instance) {
			ContactInterestsService.instance = new ContactInterestsService();
		}
		return ContactInterestsService.instance;
	}
}

const contactInterestsService = ContactInterestsService.getInstance();
export default contactInterestsService;

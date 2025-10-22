import type {
	ContactSalutation,
	Form_ContactSalutation,
} from "@/lib/types/new_type/contact_salutation";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ContactSalutationsService extends BaseService<
	ContactSalutation,
	Form_ContactSalutation
> {
	private static instance: ContactSalutationsService;

	private constructor() {
		super(APIRoutes.CONTACT_SALUTATIONS);
	}

	/**
	 * Retrieves the singleton instance of ContactInterestsService.
	 * @returns {ContactInterestsService} - The singleton instance.
	 */
	public static getInstance(): ContactSalutationsService {
		if (!ContactSalutationsService.instance) {
			ContactSalutationsService.instance = new ContactSalutationsService();
		}
		return ContactSalutationsService.instance;
	}
}

const contactSalutationsService = ContactSalutationsService.getInstance();
export default contactSalutationsService;

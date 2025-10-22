// contactsapp/lib/services/new_type/term.service.ts

import type { FormStatusNotPending } from "react-dom";
import type { UnipileIdentity } from "@/lib/types/new_type/unipile_identity";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Term-related API interactions.
 * Extends the generic BaseService with Term-specific types.
 */
class UnipleIdentityService extends BaseService<
	UnipileIdentity,
	FormStatusNotPending
> {
	private static instance: UnipleIdentityService;

	private constructor() {
		super(APIRoutes.UNIPILE_IDENTITY);
	}

	/**
	 * Retrieves the singleton instance of UnipleIdentityService.
	 * @returns {UnipleIdentityService} - The singleton instance.
	 */
	public static getInstance(): UnipleIdentityService {
		if (!UnipleIdentityService.instance) {
			UnipleIdentityService.instance = new UnipleIdentityService();
		}
		return UnipleIdentityService.instance;
	}
}

const unipleIdentityService = UnipleIdentityService.getInstance();
export default unipleIdentityService;

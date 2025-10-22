import type {
	DonationTransaction,
	Form_DonationTransaction,
} from "@/lib/types/new_type/donation_transaction";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class DonationTransactionService extends BaseService<
	DonationTransaction,
	Form_DonationTransaction
> {
	private static instance: DonationTransactionService;

	private constructor() {
		super(APIRoutes.DONATION_TRANSACTIONS);
	}

	/**
	 * Retrieves the singleton instance of DonationTransactionService.
	 * @returns {DonationTransactionService} - The singleton instance.
	 */
	public static getInstance(): DonationTransactionService {
		if (!DonationTransactionService.instance) {
			DonationTransactionService.instance = new DonationTransactionService();
		}
		return DonationTransactionService.instance;
	}
}

const donationTransactionService = DonationTransactionService.getInstance();
export default donationTransactionService;

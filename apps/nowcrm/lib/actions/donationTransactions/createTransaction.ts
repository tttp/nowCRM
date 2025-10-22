// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import donationTransactionService from "@/lib/services/new_type/donation_transcation.service";
import type {
	DonationTransaction,
	Form_DonationTransaction,
} from "@/lib/types/new_type/donation_transaction";

export async function createTransaction(
	values: Form_DonationTransaction,
): Promise<StandardResponse<DonationTransaction>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await donationTransactionService.create(values);
		return res;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

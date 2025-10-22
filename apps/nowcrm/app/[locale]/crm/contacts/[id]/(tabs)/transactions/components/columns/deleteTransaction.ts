// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import donationTransactionService from "@/lib/services/new_type/donation_transcation.service";

export async function deleteTransactionAction(
	transaction: number,
): Promise<StandardResponse<null>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const response = await donationTransactionService.unPublish(transaction);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete transaction");
	}
}

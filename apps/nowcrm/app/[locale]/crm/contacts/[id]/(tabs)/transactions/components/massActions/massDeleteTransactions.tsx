// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import donationTransactionService from "@/lib/services/new_type/donation_transcation.service";

export async function massDeleteTransactions(
	transactions: number[],
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
		const unpublishPromises = transactions.map((id) =>
			donationTransactionService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting Transaction:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

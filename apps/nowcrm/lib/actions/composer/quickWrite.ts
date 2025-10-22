// contactsapp/lib/actions/composer/quickWrite.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { QuickWriteModel } from "@/lib/types/new_type/composition";

export async function quickWrite(
	values: QuickWriteModel,
): Promise<StandardResponse<{ result: string }>> {
	const session = await auth();

	console.log("Writing with: ");
	console.log(values);
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await composerService.quickWrite(values);
		return res;
	} catch (error) {
		console.error("Error craeting a quicl write copy:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

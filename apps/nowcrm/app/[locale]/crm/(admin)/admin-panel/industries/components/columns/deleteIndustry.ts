// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import industryService from "@/lib/services/new_type/industry.service";

export async function deleteIndustryAction(
	industryId: number,
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
		const response = await industryService.unPublish(industryId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete industry");
	}
}

"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactSalutationsService from "@/lib/services/new_type/contact_salutation";

export async function deleteContactSalutationAction(
	id: number,
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
		const res = await contactSalutationsService.delete(id);
		return res;
	} catch (error) {
		console.error("Error deleting contact salutation:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

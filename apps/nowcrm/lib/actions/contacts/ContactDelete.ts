// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";

export async function deleteContactAction(
	contactId: number,
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
		const response = await contactsService.unPublish(contactId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Contact");
	}
}

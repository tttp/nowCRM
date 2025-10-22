// actions/exportContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";

export async function MassAnonymizeContacts(
	contacts: number[],
): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		for (const contactId of contacts) {
			const result = await contactsService.anonymizeContact(contactId);
			if (!result.success) {
				return { data: null, status: 500, success: false };
			}
		}

		return { data: "Anonymization completed", status: 200, success: true };
	} catch (error) {
		console.error("Error anonymizing contacts:", error);
		return { data: null, status: 500, success: false };
	}
}

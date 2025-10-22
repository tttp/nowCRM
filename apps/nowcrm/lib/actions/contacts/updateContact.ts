// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import type { Contact, Form_Contact } from "@/lib/types/new_type/contact";

export async function updateContact(
	id: number,
	values: Partial<Form_Contact>,
): Promise<StandardResponse<Contact>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactsService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating contact:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

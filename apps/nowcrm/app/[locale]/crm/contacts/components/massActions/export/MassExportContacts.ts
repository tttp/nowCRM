// actions/exportContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";

export async function MassExportContacts(
	contacts: number[],
): Promise<StandardResponse<string>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const csv = await contactsService.exportCsv(contacts);
		return { data: csv, status: 200, success: true };
	} catch (error) {
		console.error("Error exporting Contacts:", error);
		return { data: null, status: 500, success: false };
	}
}

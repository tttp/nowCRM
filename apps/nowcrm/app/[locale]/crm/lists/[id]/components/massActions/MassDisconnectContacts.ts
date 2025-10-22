// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import listsService from "@/lib/services/new_type/lists.service";

export async function MassDisconnectContacts(
	listId: number,
	contacts: number[],
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
		await listsService.update(listId, { contacts: { disconnect: contacts } });
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error removing Contacts from list:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

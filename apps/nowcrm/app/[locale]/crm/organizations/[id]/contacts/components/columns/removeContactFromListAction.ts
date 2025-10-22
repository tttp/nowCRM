// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import type { List } from "@/lib/types/new_type/list";

export async function removeContactFromListAction(
	organizationId: number,
	contactId: number,
): Promise<StandardResponse<List>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const response = await organizationService.update(organizationId, {
			contacts: { disconnect: [contactId] },
		});
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete Contact");
	}
}

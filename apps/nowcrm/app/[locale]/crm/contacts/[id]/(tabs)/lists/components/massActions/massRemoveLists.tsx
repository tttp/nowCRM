// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import listsService from "@/lib/services/new_type/lists.service";

export async function MassRemoveLists(
	lists: number[],
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
		lists.map(
			async (id) =>
				await listsService.update(id, {
					contacts: { disconnect: [contactId] },
				}),
		);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error removing Lists:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

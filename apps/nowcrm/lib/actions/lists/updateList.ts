// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import listsService from "@/lib/services/new_type/lists.service";
import type { Form_List, List } from "@/lib/types/new_type/list";

export async function updateList(
	id: number,
	values: Partial<Form_List>,
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
		const res = await listsService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating list:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

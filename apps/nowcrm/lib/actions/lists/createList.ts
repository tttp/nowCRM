// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import listsService from "@/lib/services/new_type/lists.service";
import type { List } from "@/lib/types/new_type/list";

export async function createList(
	name: string,
	contactIds?: number[],
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
		const res = await listsService.create({
			name: name,
			contacts: { connect: contactIds },
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

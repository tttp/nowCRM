// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import TagService from "@/lib/services/new_type/tag.service";
import type { Tag } from "@/lib/types/new_type/tag";

export async function fetchTags(): Promise<StandardResponse<Tag[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const query: any = {
			sort: ["id:desc"],
		};
		const res = await TagService.find(query);
		return res;
	} catch (error) {
		console.error("Error creating tag:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

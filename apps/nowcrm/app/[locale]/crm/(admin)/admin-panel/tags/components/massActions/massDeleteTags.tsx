// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import TagService from "@/lib/services/new_type/tag.service";

export async function MassDeleteTag(
	organizationTypes: number[],
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
		const unpublishPromises = organizationTypes.map((id) =>
			TagService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting tags:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

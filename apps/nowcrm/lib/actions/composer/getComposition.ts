// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import type { Composition } from "@/lib/types/new_type/composition";

export async function getComposition(
	id: number,
): Promise<StandardResponse<Composition>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const identity = await composerService.findOne(id, {
			populate: {
				"*": true,
				composition_items: {
					populate: "channel",
				},
			},
		});
		return identity;
	} catch (error) {
		console.error("Error getting composition:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import frequencyService from "@/lib/services/new_type/frequency.service";

export async function MassDeleteFrequencies(
	frequencies: number[],
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
		const unpublishPromises = frequencies.map((id) =>
			frequencyService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting frequencies:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

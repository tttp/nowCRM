// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeysService from "@/lib/services/new_type/journeys.service";
import type { Form_Journey, Journey } from "@/lib/types/new_type/journey";

export async function updateJourney(
	id: number,
	values: Partial<Form_Journey>,
): Promise<StandardResponse<Journey>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await journeysService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating journey:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

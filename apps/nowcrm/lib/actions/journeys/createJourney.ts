// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import journeysService from "@/lib/services/new_type/journeys.service";
import type { Journey } from "@/lib/types/new_type/journey";
export async function createJourney(
	name: string,
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
		const res = await journeysService.create({
			name: name,
			active: false,
			flow: "",
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

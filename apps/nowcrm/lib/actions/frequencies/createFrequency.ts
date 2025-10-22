// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import frequencyService from "@/lib/services/new_type/frequency.service";
import type { Frequency } from "@/lib/types/new_type/frequency";

export async function createFrequency(
	name: string,
): Promise<StandardResponse<Frequency>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await frequencyService.create({
			name,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating frequency:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

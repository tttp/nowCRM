// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import actionTypeService from "@/lib/services/new_type/action_type.service";
import type { ActionType } from "@/lib/types/new_type/action_type";

export async function createActionType(
	name: string,
): Promise<StandardResponse<ActionType>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await actionTypeService.create({
			name,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating Organization Type:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

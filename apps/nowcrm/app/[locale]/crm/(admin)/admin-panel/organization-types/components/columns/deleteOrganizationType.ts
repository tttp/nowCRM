// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationTypeService from "@/lib/services/new_type/ogranization_type.service";

export async function deleteOrganizationTypeAction(
	organizationTypeId: number,
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
		const response =
			await organizationTypeService.unPublish(organizationTypeId);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete organization type");
	}
}

"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";

export async function duplicateOrganizationAction(
	organizationId: number,
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
		const response = await organizationService.duplicate(organizationId);
		console.log("Organization duplicated successfully", response);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to duplicate organization");
	}
}

// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { OrganizationType } from "@nowcrm/services";
import { handleError, organizationTypesService, StandardResponse } from "@nowcrm/services/server";

export async function createOrganizationType(
	name: string,
): Promise<StandardResponse<OrganizationType>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const res = await organizationTypesService.create({
			name,
			publishedAt: new Date(),
		},session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

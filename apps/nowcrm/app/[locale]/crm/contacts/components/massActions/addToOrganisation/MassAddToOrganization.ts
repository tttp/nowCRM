// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import type { Organization } from "@/lib/types/new_type/organization";

export async function MassAddToOrganization(
	contactIds: number[],
	organization_id: number,
): Promise<StandardResponse<Organization>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await organizationService.update(organization_id, {
			contacts: { connect: contactIds },
		});
		return res;
	} catch (error) {
		console.error("Error adding to list:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

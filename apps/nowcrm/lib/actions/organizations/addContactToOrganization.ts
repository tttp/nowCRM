// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import type { Organization } from "@/lib/types/new_type/organization";

export async function addContactToOrganization(
	organizationId: number,
	contactId: number,
): Promise<StandardResponse<Organization>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	console.log(organizationId, contactId);
	try {
		const res = await organizationService.update(organizationId, {
			contacts: { connect: [contactId] },
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

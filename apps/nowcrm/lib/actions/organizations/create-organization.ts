// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import { Form_Organization, Organization } from "@nowcrm/services";
import { handleError, organizationsService, StandardResponse } from "@nowcrm/services/server";

export async function createOrganization(
	values: Form_Organization,
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
		const res = await organizationsService.create(values,session.jwt);
		return res;
	} catch (error) {
		return handleError(error);
	}
}

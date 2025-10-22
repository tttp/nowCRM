// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import type {
	Form_Organization,
	Organization,
} from "@/lib/types/new_type/organization";

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
		console.log(values);
		const res = await organizationService.create(values);
		return res;
	} catch (error) {
		console.error("Error creating organization:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

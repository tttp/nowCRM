// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import type {
	Form_Organization,
	Organization,
} from "@/lib/types/new_type/organization";

export async function updateOrganization(
	id: number,
	values: Partial<Form_Organization>,
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
		const res = await organizationService.update(id, values);
		return res;
	} catch (error) {
		console.error("Error updating journey:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

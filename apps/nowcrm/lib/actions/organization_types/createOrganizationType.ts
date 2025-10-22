// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationTypeService from "@/lib/services/new_type/ogranization_type.service";
import type { OrganizationType } from "@/lib/types/new_type/organization_type";

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
		const res = await organizationTypeService.create({
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

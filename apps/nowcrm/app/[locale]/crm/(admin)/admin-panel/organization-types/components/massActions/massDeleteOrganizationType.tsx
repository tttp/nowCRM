// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import organizationTypeService from "@/lib/services/new_type/ogranization_type.service";

export async function MassDeleteOrganizationTypes(
	organizationTypes: number[],
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
		const unpublishPromises = organizationTypes.map((id) =>
			organizationTypeService.unPublish(id),
		);
		await Promise.all(unpublishPromises);
		return {
			data: null,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error deleting organization types:", error);
		return {
			data: null,
			status: 500,
			success: false,
		};
	}
}

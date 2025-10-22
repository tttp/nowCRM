"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactTitlesService from "@/lib/services/new_type/contact_title";
import type { ContactTitle } from "@/lib/types/new_type/contact_title";

export async function updateContactTitle(
	id: number,
	name: string,
): Promise<StandardResponse<ContactTitle>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactTitlesService.update(id, {
			name: name,
		});
		return res;
	} catch (error) {
		console.error("Error updating contact title:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

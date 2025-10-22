// actions/createContactSalutation.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactSalutationsService from "@/lib/services/new_type/contact_salutation";
import type { ContactSalutation } from "@/lib/types/new_type/contact_salutation";

export async function createContactSalutation(
	name: string,
): Promise<StandardResponse<ContactSalutation>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		const res = await contactSalutationsService.create({
			name: name,
			publishedAt: new Date(),
		});
		return res;
	} catch (error) {
		console.error("Error creating contact salutation:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

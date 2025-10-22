"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import type { Contact } from "@/lib/types/new_type/contact";

export async function exportContact(
	contactId: number,
): Promise<StandardResponse<Contact>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
			errorMessage: "Unauthorized access",
		};
	}
	try {
		const res = await contactsService.exportUserData(contactId);

		if (res.success && res.data) {
			return {
				data: res.data,
				status: 200,
				success: true,
			};
		} else {
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: res.message ?? "Failed to export contact",
			};
		}
	} catch (error: any) {
		console.error("Error exporting contact:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error?.message || "Unexpected error occurred"}`,
		};
	}
}

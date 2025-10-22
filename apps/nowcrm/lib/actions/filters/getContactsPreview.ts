"use server";

import contactsService from "@/lib/services/new_type/contacts.service";

export async function getContactsPreview(filters: any) {
	const result = await contactsService.find({
		populate: "*",
		sort: ["id:desc"],
		pagination: { page: 1, pageSize: 5 },
		filters,
	});

	return result;
}

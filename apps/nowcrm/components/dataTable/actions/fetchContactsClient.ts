"use server";

import { auth } from "@/auth";
import { transformFilters } from "@/lib/actions/filters/filtersSearch";
import contactsService from "@/lib/services/new_type/contacts.service";

type FetchContactsParams = {
	page?: number;
	pageSize?: number;
	search?: string;
	rawFilters?: Record<string, any>;
};

export async function fetchContactsAction({
	page = 1,
	pageSize = 10,
	search = "",
	rawFilters = {},
}: FetchContactsParams) {
	const session = await auth();
	if (!session) {
		return {
			success: false,
			message: "Unauthorized",
			data: [],
			totalCount: 0,
		};
	}

	const filters = transformFilters(rawFilters);

	// Add search across multiple fields
	const combinedFilters = {
		...filters,
		$or: [
			{ email: { $containsi: search } },
			{ phone: { $containsi: search } },
			{ first_name: { $containsi: search } },
			{ last_name: { $containsi: search } },
			{ contact_types: { name: { $eq: search } } },
			{ subscriptions: { channel: { name: { $eq: search } } } },
			{ actions: { action_normalized_type: { name: { $eq: search } } } },
		],
	};

	try {
		const { data, totalCount } = await contactsService.fetchWithFilters(
			combinedFilters,
			page,
			pageSize,
		);

		return {
			success: true,
			data,
			totalCount,
		};
	} catch (error: any) {
		console.error("Fetch contacts action error:", error);
		return {
			success: false,
			message: error.message || "Unexpected error",
			data: [],
			totalCount: 0,
		};
	}
}

// src/lib/actions/contacts/getCountries.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";

type CountryWithCount = { name: string; count: number };

/**
 * Get all unique countries from contacts in Strapi with counts
 */
export async function getCountries(): Promise<
	StandardResponse<CountryWithCount[]>
> {
	const session = await auth();
	if (!session) {
		return {
			data: [],
			status: 403,
			success: false,
			errorMessage: "Unauthorized",
		};
	}

	try {
		const res = await contactsService.find({
			fields: ["country"],
			pagination: { pageSize: 1000 }, // adjust if more than 1000
		});

		if (!res?.success || !res.data) {
			return {
				data: [],
				status: 500,
				success: false,
				errorMessage: "Failed to fetch contacts",
			};
		}

		// Count by country
		const countryCounts: Record<string, number> = {};
		for (const contact of res.data) {
			if (contact.country) {
				countryCounts[contact.country] =
					(countryCounts[contact.country] || 0) + 1;
			}
		}

		// Transform to sorted array
		const countries: CountryWithCount[] = Object.entries(countryCounts)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));

		return {
			data: countries,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error fetching countries:", error);
		return {
			data: [],
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

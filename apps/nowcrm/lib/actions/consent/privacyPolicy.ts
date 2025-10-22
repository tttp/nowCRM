"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import consentService from "@/lib/services/new_type/consent.service";
import type { Consent } from "@/lib/types/new_type/consent";

export async function getLatestConsents(
	locale: string,
	id?: number,
): Promise<StandardResponse<Consent[]>> {
	// Step 1: If version is provided, attempt to fetch it
	if (id !== undefined) {
		const filteredResponse = await consentService.find(
			{
				locale,
				populate: "*",
				filters: {
					active: { $eq: true },
					version: { $eqi: String(id) },
				},
			},
			true,
		);
		const found = filteredResponse?.data?.length;
		if (found) {
			return filteredResponse;
		}
		// Else: fall through to fallback logic
	}

	// Step 2: Get the latest active consent (fallback or default)
	const latestResponse = await consentService.find(
		{
			locale,
			sort: ["id:desc"],
			pagination: { pageSize: 1 },
			populate: "*",
			filters: {
				active: { $eq: true },
			},
		},
		true,
	);

	return latestResponse;
}

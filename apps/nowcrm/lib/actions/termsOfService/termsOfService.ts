"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import termService from "@/lib/services/new_type/term.service";
import type { Term } from "@/lib/types/new_type/term";

export async function getLatestTerms(
	_locale = "en",
): Promise<StandardResponse<Term[]>> {
	// Define the query to filter active terms.

	console.log("requesting terms");
	const termData = await termService.find(
		{
			populate: "*",
			filters: { active: { $eq: true } },
			sort: ["id:desc"],
		},
		true,
	);

	// Return the complete array of term objects.
	return termData;
}

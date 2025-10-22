// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import textBlockService from "@/lib/services/new_type/text_blocks.service";
import type { LanguageKeys } from "@/lib/static/languages";
import type { TextBlock } from "@/lib/types/new_type/text_blocks";

export async function getLocalizedTextBlock(
	name: string,
): Promise<StandardResponse<{ locale: string; data: TextBlock }[]>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	const locales: LanguageKeys[] = ["en", "de", "it", "fr"];
	try {
		const fetchPromises = locales.map(async (loc) => {
			const response = await textBlockService.find({
				filters: { name: { $eq: name } },
				locale: loc,
			});
			if (!response.data || !(response.data.length > 0)) {
				const item = await textBlockService.create({
					name,
					publishedAt: new Date(),
					text: "",
					locale: loc,
				});
				return { locale: loc, data: item.data as TextBlock };
			}
			return { locale: loc, data: response.data[0] };
		});

		const results = await Promise.all(fetchPromises);

		return {
			data: results,
			status: 200,
			success: true,
		};
	} catch (error) {
		console.error("Error adding to group:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

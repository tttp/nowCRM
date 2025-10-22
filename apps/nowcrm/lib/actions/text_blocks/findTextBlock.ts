"use server";
import { auth } from "@/auth";
import textBlockService from "@/lib/services/new_type/text_blocks.service";
import type StrapiQuery from "@/lib/types/common/StrapiQuery";
import type { TextBlock } from "@/lib/types/new_type/text_blocks";

export async function findTextBlock(
	query: StrapiQuery<TextBlock>,
): Promise<string[]> {
	const session = await auth();
	if (!session) return [];

	try {
		const textBlocks = await textBlockService.find(query);
		return textBlocks.data
			? textBlocks.data.map((item) => {
					return `text_block.${item.name.replaceAll(" ", "-")}`;
				})
			: [];
	} catch (error) {
		console.error("Error getting subscription:", error);
		return [];
	}
}

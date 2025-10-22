import type {
	Form_TextBlock,
	TextBlock,
} from "@/lib/types/new_type/text_blocks";
// contactsapp/lib/services/new_type/term.service.ts
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Term-related API interactions.
 * Extends the generic BaseService with Term-specific types.
 */
class TextBlockService extends BaseService<TextBlock, Form_TextBlock> {
	private static instance: TextBlockService;

	private constructor() {
		super(APIRoutes.TEXTBLOCKS);
	}

	/**
	 * Retrieves the singleton instance of TextBlockService.
	 * @returns {TextBlockService} - The singleton instance.
	 */
	public static getInstance(): TextBlockService {
		if (!TextBlockService.instance) {
			TextBlockService.instance = new TextBlockService();
		}
		return TextBlockService.instance;
	}
}

const textBlockService = TextBlockService.getInstance();
export default textBlockService;

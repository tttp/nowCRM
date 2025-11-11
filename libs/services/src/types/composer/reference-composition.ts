import type { aiModelKeys } from "../../static/ai-models";
import type { LanguageKeys } from "../../static/languages";
import type { CompositionStatusKeys } from "../composition";
import type { DocumentId } from "../common/base_type";

export interface ReferenceComposition {
	title?: string;
	subject?: string;
	composition_status?: CompositionStatusKeys;
	language?: LanguageKeys;
	mainChannel?: DocumentId;
	category?: string;
	promptBase?: string;
	persona?: string;
	model: aiModelKeys;
	prompt: string;
}

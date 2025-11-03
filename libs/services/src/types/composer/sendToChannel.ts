import { UnipileIdentity } from "types/unipie-identity";
import { composerSendType } from "./composer-send-types";
import { DocumentId } from "types/common/base_type";


export interface sendToChannelsData {
	composition_id: DocumentId;
	channels: string[];
	to?: DocumentId | DocumentId[] | string | string[];
	type?: composerSendType;
	from?: string;
	searchMask?: Record<string, any>;
	subject?: string;
	account?: UnipileIdentity;
	throttle?: number;
	interval?: number;
	contacts?: string;
	title?: string;
	ignoreSubscription?: boolean;
	// user_id: number // will be used when tokens will be used not from env but from settings
}

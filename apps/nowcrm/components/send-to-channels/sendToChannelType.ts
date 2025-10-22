import type { UnipileIdentity } from "@/lib/types/new_type/unipile_identity";

export interface sendToChannelsData {
	composition_id: number;
	channels: string[];
	to?: number | number[] | string | string[];
	type?: "list" | "contact" | "organization"; // used to identify is this get list contacts,get organization contact, contact/contacts
	from?: string; //used for email identity
	throttle?: number; //used for email identity
	subject?: string; //used for email subject
	account?: UnipileIdentity;
	interval?: number;
	// user_id: number // will be used when tokens will be used not from env but from settings
}

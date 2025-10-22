import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";
import type { User } from "./user";

export interface ActivityLog extends BaseType {
	action: string;
	description: string;
	contact: Contact;
	user: User;
}

export interface Form_ActivityLog extends Omit<BaseFormType, "name"> {
	action: string;
	description?: string;
	contact: number;
	user?: number;
}

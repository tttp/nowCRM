import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";
import type { User } from "./user";

export type TaskStatus = "planned" | "in progress" | "done" | "expired";

// Filters - json which used for strapi filters for entity for coresponding type
export interface Task extends BaseType {
	contact: Contact;
	description: string;
	action: string;
	due_date: string;
	assigned_to: User;
	status: TaskStatus;
}

export interface Form_Task extends BaseFormType {
	contact: number;
	description?: string;
	action?: string;
	due_date?: Date;
	assigned_to: number;
	status?: TaskStatus;
}

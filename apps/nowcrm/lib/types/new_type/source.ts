import type { BaseFormType, BaseType } from "../common/base_type";
import type { Contact } from "./contact";

export interface Source extends BaseType {
	name: string;
	contacts: Contact[];
}

export interface Form_Source extends BaseFormType {
	name: string;
	contacts: number[] | { connect: number[] };
}

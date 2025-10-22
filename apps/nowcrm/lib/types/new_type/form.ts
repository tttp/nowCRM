import type { StrapiImageFormat } from "@/lib/services/new_type/assets/asset.ts";
import type { BaseFormType, BaseType } from "../common/base_type";
// Filters - json which used for strapi filters for entity for coresponding type

export interface FormEntity extends BaseType {
	name: string;
	description?: string;
	submit_confirm_text?: string;
	submission_success_text?: string;
	slug?: string;
	active: boolean;
	webhook_url?: string;
	cover?: StrapiImageFormat;
	logo?: StrapiImageFormat;
	brand_color?: string;
	submit_text?: string;
	keep_contact?: boolean;
	override_contact?: boolean;
	form_view?: boolean;
	form_items: FormItemEntity[];
}

export interface Form_FormEntity
	extends Omit<BaseFormType, "publishedAt" | "name"> {
	name?: string;
	description?: string;
	submit_confirm_text?: string;
	submission_success_text?: string;
	slug?: string;
	active?: boolean;
	cover?: StrapiImageFormat;
	logo?: StrapiImageFormat;
	webhook_url?: string;
	brand_color?: string;
	submit_text?: string;
	keep_contact?: boolean;
	override_contact?: boolean;
	form_view?: boolean;
	publishedAt?: Date;
	form_items?: FormItemEntity[];
}

export interface FormItemEntity extends BaseType {
	name: string;
	type: string;
	label: string;
	required?: boolean;
	options: string[];
	rank?: number;
	hidden?: boolean;
	form?: FormEntity;
}

export interface Form_FormItemEntity extends Omit<BaseFormType, "publishedAt"> {
	name: string;
	type: string;
	label: string;
	rank?: number;
	hidden?: boolean;
	required?: boolean;
	options: string[];
	form?: number;
	publishedAt?: Date;
}

export interface CustomForm_FormItemEntity
	extends Omit<BaseFormType, "publishedAt"> {
	id?: number;
	name: string;
	type: string;
	label: string;
	rank?: number;
	hidden?: boolean;
	required?: boolean;
	options: string[];
	form?: number;
	publishedAt?: Date;
}

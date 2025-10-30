import type Asset from "./common/asset";
import type { BaseFormType, BaseType } from "./common/base_type";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { FormEntityItem } from "./form-item";
export interface FormEntity extends BaseType {
	description: string;
	submit_confirm_text: string;
	submission_success_text: string;
	form_items: FormEntityItem[];
	active: boolean;
	slug: string;
	cover: Asset;
	webhook_url: string;
	submit_text: string;
	brand_color: string;
	logo: Asset;
	keep_contact: boolean;
	google_sheets_url: string;
	excel_url: string;
	override_contact: boolean;
	form_view: boolean;
}

export interface Form_FormEntity extends BaseFormType {
	description: string;
	submit_confirm_text: string;
	submission_success_text: string;
	form_items: StrapiConnect;
	active: boolean;
	slug: string;
	cover: Asset;
	webhook_url: string;
	submit_text: string;
	brand_color: string;
	logo: Asset;
	keep_contact: boolean;
	google_sheets_url: string;
	excel_url: string;
	override_contact: boolean;
	form_view: boolean;
}

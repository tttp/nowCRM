import type { BaseFormType, BaseType } from "../common/base_type";

export type EditorTextTypes = "text" | "html";
export type FileUploadTypes = "image" | "all";

export function getFileUploadMimeType(type: FileUploadTypes): string {
	return type === "image" ? "image/*" : "*";
}
// Filters - json which used for strapi filters for entity for coresponding type
export interface Channel extends BaseType {
	name: string;
	editor_text_type: EditorTextTypes;
	removeHtml: boolean;
	file_upload_type: FileUploadTypes;
	max_content_lenght: number;
	throttle: number;
	max_sending_quota: number;
	max_sending_rate: number;
}

export interface Form_Channel extends BaseFormType {
	name: string;
	editor_text_type: string;
	removeHtml: boolean;
	file_upload_type: FileUploadTypes;
	max_content_lenght: number;
	throttle: number;
	max_sending_quota: number;
	max_sending_rate: number;
}

import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import type { Option } from "./common/option";
import type { Setting } from "./setting";

export type CredentialStatuses = "active" | "invalid" | "disconnected";

export const CredentialStatusField: Option[] = [
	{ label: "active", value: "active" },
	{ label: "invalid", value: "invalid" },
	{ label: "disconnected", value: "disconnected" },
];

export interface SettingCredential extends BaseType {
	setting: Setting;
	credential_status: CredentialStatuses;
	access_token: string;
	refresh_token: string;
	client_id: string;
	client_secret: string;
	wp_url: string;
	wp_app_password: string;
	error_message: string;
	organization_urn: string;
	twitter_app_key: string;
	twitter_app_secret: string;
	twitter_access_token: string;
	twitter_access_secret: string;
}

export interface Form_SettingCredential extends BaseFormType {
	setting: DocumentId;
	credential_status: CredentialStatuses;
	access_token: string;
	refresh_token: string;
	client_id: string;
	client_secret: string;
	wp_url: string;
	wp_app_password: string;
	error_message: string;
	organization_urn: string;
	twitter_app_key: string;
	twitter_app_secret: string;
	twitter_access_token: string;
	twitter_access_secret: string;
}

import type { BaseFormType, BaseType } from "../common/base_type";
import type { StrapiConnect } from "../common/StrapiQuery";

export type SubscriptionStatuses = "verify" | "ignore";

export type SubscriptionStatus = {
	label: string;
	value: string;
};

export const SubscriptionStatusesField: SubscriptionStatus[] = [
	{ label: "verify", value: "verify" },
	{ label: "ignore", value: "ignore" },
];

export type CredentialStatuses = "active" | "invalid" | "disconnected";

export type CredentialStatus = {
	label: string;
	value: string;
};

export const CredentialStatusField: SubscriptionStatus[] = [
	{ label: "active", value: "active" },
	{ label: "invalid", value: "invalid" },
	{ label: "disconnected", value: "disconnected" },
];

export interface SettingCredential extends BaseType {
	status: CredentialStatuses;
	access_token: string;
	refresh_token: string;
	client_id: string;
	client_secret: string;
	wp_url: string;
	wp_app_password: string;
	setting: Omit<Settings, "setting_credentials">;
	error_message: string;
	organization_urn: string;
	twitter_app_key: string;
	twitter_app_secret: string;
	twitter_access_token: string;
	twitter_access_secret: string;
}

export interface Form_SettingCredential extends BaseFormType {
	status: CredentialStatuses;
	access_token?: string;
	refresh_token?: string;
	client_id?: string;
	client_secret?: string;
	wp_url?: string;
	wp_app_password?: string;
	setting: number;
	error_message?: string;
	organization_urn?: string;
	twitter_app_key?: string;
	twitter_app_secret?: string;
	twitter_access_token?: string;
	twitter_access_secret?: string;
}

export interface Settings extends BaseType {
	subscription: SubscriptionStatuses;
	subscription_journeys: SubscriptionStatuses;
	unsubscribe_text: string;
	setting_credentials: Omit<SettingCredential, "setting">[];
}

export interface Form_Settings extends BaseFormType {
	subscription: SubscriptionStatuses;
	subscription_journeys: SubscriptionStatuses;
	unsubscribe_text: string;
	setting_credentials: StrapiConnect;
}

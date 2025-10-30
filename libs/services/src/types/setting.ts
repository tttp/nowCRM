import type { BaseFormType, BaseType } from "./common/base_type";
import type { StrapiConnect } from "./common/StrapiQuery";
import type { SettingCredential } from "./setting-credential";

export type settingSubscriptionCheck = "verify" | "ignore";

export type settingSubscriptionJourneysCheck = "verify" | "ignore";

export interface Setting extends Omit<BaseType, "name"> {
	subscription: settingSubscriptionCheck;
	subscription_journeys: settingSubscriptionJourneysCheck;
	unsubscribe_text: string;
	setting_credentials: SettingCredential[];
}

export interface Form_Setting extends Omit<BaseFormType, "name"> {
	subscription: settingSubscriptionCheck;
	subscription_journeys: settingSubscriptionJourneysCheck;
	unsubscribe_text: string;
	setting_credentials: StrapiConnect;
}

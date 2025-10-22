import ErrorMessage from "@/components/ErrorMessage";
import { env } from "@/lib/config/envConfig";
import settingsService from "@/lib/services/new_type/settings.service";
import { ChannelHealthCheck } from "./components/channelsHealthCheck/channelsHealthCheck";
import { ChannelSettingsForm } from "./components/channelsSettings";

export default async function Page() {
	const settings_item = await settingsService.findOne(1, { populate: "*" });
	if (!settings_item.success || !settings_item.data || !settings_item.meta) {
		return <ErrorMessage response={settings_item} />;
	}

	return (
		<div>
			<ChannelHealthCheck settings={settings_item.data} />
			<ChannelSettingsForm
				initialSubscription={settings_item.data.subscription || "ignore"}
				initialUnsubscribeText={settings_item.data.unsubscribe_text || ""}
				baseLink={env.CRM_BASE_URL}
			/>
		</div>
	);
}

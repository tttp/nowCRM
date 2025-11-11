import ErrorMessage from "@/components/ErrorMessage";
import { env } from "@/lib/config/envConfig";
import { settingsService } from "@nowcrm/services/server";
import { ChannelHealthCheck } from "./components/channelsHealthCheck/channelsHealthCheck";
import { ChannelSettingsForm } from "./components/channelsSettings";
import { auth } from "@/auth";

export default async function Page() {
	const session = await auth();
	const settings_item = await settingsService.find(session?.jwt, { populate: "*" });
	if (!settings_item.success || !settings_item.data || !settings_item.meta) {
		return <ErrorMessage response={settings_item} />;
	}

	return (
		<div>
			<ChannelHealthCheck settings={settings_item.data[0]} />
			<ChannelSettingsForm
				initialSubscription={settings_item.data[0].subscription || "ignore"}
				initialUnsubscribeText={settings_item.data[0].unsubscribe_text || ""}
				baseLink={env.CRM_BASE_URL}
			/>
		</div>
	);
}

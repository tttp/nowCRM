import type { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import channelService from "@/lib/services/new_type/channel.service";
import CreateCompositionCard from "./components/CreateCard";

export const metadata: Metadata = {
	title: "Create Composition",
};

export default async function Page() {
	// here we get active channels for select
	// we dont use async select for better error handling + now alowing user to select in additional info
	// same channel 2 times
	// also hardocded limit so we always get all channels
	const response = await channelService.find({
		sort: ["id:asc"],
		pagination: { limit: 100 },
	});

	if (!response.success || !response.data) {
		return <ErrorMessage response={response} />;
	}

	const active_channels = response.data?.map((channel) => {
		return {
			value: `${channel.id}`,
			label: channel.name,
		};
	});

	return <CreateCompositionCard channels={active_channels} />;
}

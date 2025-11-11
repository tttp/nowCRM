import type { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { channelsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
import CreateCompositionCard from "./components/CreateCard";

export const metadata: Metadata = {
	title: "Create Composition",
};

export default async function Page() {
	const session = await auth();
	// here we get active channels for select
	// we dont use async select for better error handling + now alowing user to select in additional info
	// same channel 2 times
	// also hardocded limit so we always get all channels
	const response = await channelsService.find(session?.jwt, {
		sort: ["documentId:asc"],
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

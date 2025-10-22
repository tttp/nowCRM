import ErrorMessage from "@/components/ErrorMessage";
import composerService from "@/lib/services/new_type/composer.service";
import { CompositionView } from "./components/composition-view";

// This would be replaced with your actual data fetching logic

export default async function CompositionPage(props: {
	params: Promise<{ id: number }>;
}) {
	const params = await props.params;
	const response = await composerService.findOne(
		params.id,

		{
			populate: {
				composition_items: {
					populate: ["channel", "attached_files"],
				},
			},
		},
	);
	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	return <CompositionView composition={response.data} />;
}

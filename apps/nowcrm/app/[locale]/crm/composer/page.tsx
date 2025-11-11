import type { Metadata } from "next";

import ComposerTable from "./components/composerTable";
import { PaginationParams } from "@nowcrm/services";
export const metadata: Metadata = {
	title: "Compositions",
};

export default async function Page(props: {
	searchParams: Promise<PaginationParams>;
}) {
	const searchParams = await props.searchParams;
	return (
		<div className="container">
			<ComposerTable searchParams={searchParams} />
		</div>
	);
}

import type { Metadata } from "next";
import type { PaginationParams } from "@/lib/types/common/paginationParams";
import ComposerTable from "./components/composerTable";

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

import type { Session } from "next-auth";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import { PaginationParams } from "@nowcrm/services";
import { compositionsService } from "@nowcrm/services/server";
import { columns } from "./columns/composerColumns";
import MassActionsLists from "./massActions/massActions";

export default async function ComposerTable({
	searchParams,
}: {
	searchParams: PaginationParams;
}) {
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "updatedAt",
		sortOrder = "desc",
	} = searchParams;

	// Fetch data from the contactService
	const session = await auth();
	const response = await compositionsService.find(session?.jwt, {
		populate: "*",
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			$or: [{ name: { $containsi: search } }],
		},
	});

	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	const { meta } = response;

	return (
		<DataTable
			data={response.data}
			columns={columns}
			table_name="composer"
			table_title="Composer"
			mass_actions={MassActionsLists}
			pagination={meta.pagination}
			session={session as Session}
			sorting={{ sortBy, sortOrder }}
			showStatusModal={true}
		/>
	);
}

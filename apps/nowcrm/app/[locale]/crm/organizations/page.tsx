import type { Metadata } from "next";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import {
	parseQueryToFilterValues,
	transformFilters,
} from "@/lib/actions/filters/filters-search";
import AdvancedFilters from "./components/advancedFilters/advancedFilters";
import { columns } from "./components/columns/organizationColumns";
import createOrganizationDialog from "./components/createDialog";
import MassActionsContacts from "./components/massActions/MassActions";
import { organizationsService } from "@nowcrm/services/server";
export const metadata: Metadata = {
	title: "Organizations",
};

export default async function Page(props: { searchParams: Promise<any> }) {
	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
		...urlFilters
	} = searchParams;
	const flatFilters = parseQueryToFilterValues<Record<string, any>>(
		new URLSearchParams(urlFilters),
	);
	const transformedFilters = transformFilters(flatFilters);
	// Fetch data from the contactService
	const session = await auth();
	const response = await organizationsService.find(session?.jwt, {
		populate: "*",
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			...transformedFilters,
			$or: [
				{ name: { $containsi: search } },
				{ email: { $containsi: search } },
			],
		},
	});

	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	const { meta } = response;

	return (
		<div className="container">
			<DataTable
				data={response.data}
				columns={columns}
				table_name="organizations"
				table_title="Organizations"
				mass_actions={MassActionsContacts}
				pagination={meta.pagination}
				createDialog={createOrganizationDialog}
				advancedFilters={AdvancedFilters}
				session={session as Session}
				showStatusModal
				sorting={{ sortBy, sortOrder }}
			/>
		</div>
	);
}

import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import { PaginationParams } from "@nowcrm/services";
import { columns } from "./components/columns/campaignsColumns";
import createCampaignDialog from "./components/createDialog";
import MassActionsCampaigns from "./components/massActions/massActions";
import { campaignsService } from "@nowcrm/services/server";

export default async function Page(props: {
	searchParams: Promise<PaginationParams>;
}) {
	const t = await getTranslations("Admin.Campaign");

	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
	} = searchParams;
	const session = await auth();
	const response = await campaignsService.find(session?.jwt, {
		populate: {
			campaign_category: {
				fields: ["id", "name"],
			},
		},
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			$or: [
				{ name: { $containsi: search } },
				{ description: { $containsi: search } },
			],
		},
	});
	// Handle the response based on success status
	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}

	const { meta } = response;

	return (
		<DataTable
			data={response.data}
			columns={columns}
			table_name="campaigns"
			table_title={t("table_title")}
			mass_actions={MassActionsCampaigns}
			createDialog={createCampaignDialog}
			pagination={meta.pagination}
			session={session as Session}
			sorting={{ sortBy, sortOrder }}
		/>
	);
}

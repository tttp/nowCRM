import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import { PaginationParams } from "@nowcrm/services";
import { contactSalutationsService } from "@nowcrm/services/server";
import { columns } from "./components/columns/contactSalutationsColumns";
import createContactSalutationDialog from "./components/createDialog";
import MassActionsContactSalutations from "./components/massActions/massActions";

export default async function Page(props: {
	searchParams: Promise<PaginationParams>;
}) {
	const t = await getTranslations("Admin.ContactSalutation");

	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
	} = searchParams;
	const session = await auth();
	const response = await contactSalutationsService.find(session?.jwt, {
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
	// Handle the response based on success status
	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}

	const { meta } = response;

	return (
		<DataTable
			data={response.data}
			columns={columns}
			table_name="contact_salutations"
			table_title={t("table_title")}
			mass_actions={MassActionsContactSalutations}
			createDialog={createContactSalutationDialog}
			pagination={meta.pagination}
			session={session as Session}
			sorting={{ sortBy, sortOrder }}
		/>
	);
}

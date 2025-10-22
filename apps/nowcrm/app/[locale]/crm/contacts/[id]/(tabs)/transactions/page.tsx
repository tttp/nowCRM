import type { Metadata } from "next";
import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import donationTransactionService from "@/lib/services/new_type/donation_transcation.service";
import type { PaginationParams } from "@/lib/types/common/paginationParams";
import { columns } from "./components/columns/transactionColumns";
import createListDialog from "./components/createDialog";
import DonationTransactionMassActions from "./components/massActions/massActions";

export const metadata: Metadata = {
	title: "Contact transactions",
};
export default async function Page(props: {
	searchParams: Promise<PaginationParams>;
	params: Promise<{ id: number }>;
}) {
	const t = await getTranslations();
	const params = await props.params;
	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
	} = searchParams;
	// Fetch data from the contactService
	const session = await auth();

	const response = await donationTransactionService.find({
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			$or: [
				{ card_holder_name: { $containsi: search } },
				{ payment_method: { $containsi: search } },
				{ payment_provider: { $containsi: search } },
			],
			contact: { id: { $eq: params.id } },
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
			table_name="transactions"
			table_title={t("Contacts.transactions.table_title")}
			mass_actions={DonationTransactionMassActions}
			pagination={meta.pagination}
			session={session as Session}
			createDialog={createListDialog}
			sorting={{ sortBy, sortOrder }}
		/>
	);
}

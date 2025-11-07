import type { Metadata } from "next";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import ErrorMessage from "@/components/ErrorMessage";
import ContactsTableClient from "./ContactsTableClient";
import EditableTitle from "./components/editTitle";
import { DocumentId, PaginationParams } from "@nowcrm/services";
import { contactsService, listsService } from "@nowcrm/services/server";

export const metadata: Metadata = {
	title: "Contacts",
};

export default async function Page(props: {
	params: Promise<{ id: DocumentId }>;
	searchParams: Promise<PaginationParams>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const {
		page = 1,
		pageSize = 10,
		sortBy = "id",
		sortOrder = "desc",
	} = searchParams;

	// Fetch data from the contactService
	const session = await auth();
	const list = await listsService.findOne(params.id, session?.jwt);
	if (!list.success || !list.data || !list.meta) {
		return <ErrorMessage response={list} />;
	}
	const listFilter = { lists: { documentId: { $eq: params.id } } };
	const response = await contactsService.find(session?.jwt, {
		fields: [
			"documentId",
			"first_name",
			"last_name",
			"email",
			"country",
			"job_description",
			"duration_role",
			"connection_degree",
		],
		populate: {
			tags: {
				fields: ["name"],
			},
			industry: {
				fields: ["name"],
			},
			contact_types: {
				fields: ["name"],
			},
			title: {
				fields: ["name"],
			},
			salutation: {
				fields: ["name"],
			},
			job_title: {
				fields: ["name"],
			},
		},
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			...listFilter,
		},
	});

	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	const { meta } = response;

	return (
		<div className="container">
			<EditableTitle title={list.data.name} />
			<ContactsTableClient
				initialData={response.data}
				initialPagination={meta.pagination}
				sortBy={sortBy}
				sortOrder={sortOrder}
				tableTitle={"Contacts of list"}
				tableName="contacts"
				session={session as Session}
				serverFilters={listFilter}
			/>
		</div>
	);
}

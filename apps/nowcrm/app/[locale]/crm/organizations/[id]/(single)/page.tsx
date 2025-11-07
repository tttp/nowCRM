import type { Session } from "next-auth";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/dataTable";
import ErrorMessage from "@/components/ErrorMessage";
import { TypographyH3 } from "@/components/Typography";
import { transformFilters } from "@/lib/actions/filters/filters-search";
import AdvancedFilters from "../../../contacts/components/advancedFilters/advancedFilters";
import addToListDialog from "../contacts/components/addToListDialog";
import { columns } from "../contacts/components/columns/ContactColumns";
import MassActionsContacts from "../contacts/components/massActions/MassActions";
import { OrganizationAddressCard } from "./components/adressInfo/addressCard";
import { OrganizationGeneralInfoCard } from "./components/generalInfo/generalInfoCard";
import { OrganizationProfessionalInfoCard } from "./components/professionalInfo/professionalInfoCard";
import { DocumentId, PaginationParams } from "@nowcrm/services";
import { contactsService, organizationsService } from "@nowcrm/services/server";

export default async function Home(props: {
	params: Promise<{ id: DocumentId }>;
	searchParams: Promise<PaginationParams>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
		...rawFilters
	} = searchParams;
	const transformedFilters = transformFilters(rawFilters);

	const session = await auth();
	const organization = await organizationsService.findOne(params.id, session?.jwt);
	if (!organization.success || !organization.data || !organization.meta) {
		return <ErrorMessage response={organization} />;
	}
	const response = await contactsService.find(session?.jwt, {
		populate: "*",
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			...transformedFilters,
			$or: [
				{ email: { $containsi: search } },
				{ phone: { $containsi: search } },
				{ first_name: { $containsi: search } },
			],
			organization: { name: { $eq: organization.data.name } },
		},
	});

	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}
	const { meta } = response;

	return (
		<>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<OrganizationGeneralInfoCard organization={organization.data} />
				<OrganizationAddressCard organization={organization.data} />
				<OrganizationProfessionalInfoCard organization={organization.data} />
			</div>
			<div className="mt-6">
				<div className="flex items-center gap-2">
					<TypographyH3 className={"py-2 capitalize"}>
						Contacts list
					</TypographyH3>
				</div>
				<DataTable
					data={response.data}
					columns={columns}
					table_name="contacts"
					table_title="Contacts of list"
					mass_actions={MassActionsContacts}
					pagination={meta.pagination}
					advancedFilters={AdvancedFilters}
					createDialog={addToListDialog}
					session={session as Session}
					sorting={{ sortBy, sortOrder }}
				/>
			</div>
		</>
	);
}

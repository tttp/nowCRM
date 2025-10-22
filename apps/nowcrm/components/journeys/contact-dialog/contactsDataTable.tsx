"use client";

import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Contact } from "@/lib/types/new_type/contact";
import createContactDialog from "./add-contacts-dialog";
import { fetchContactsAction } from "./fetchContacts";
import { columns } from "./table/columns/columns";
import DataTable from "./table/DataTable";
import MassActionsContacts from "./table/massActions/massActions";

export default function ContactsPageClient({ step_id }: { step_id: number }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [data, setData] = useState<Contact[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState<any>(null);

	const page = Number(searchParams.get("page")) || 1;
	const pageSize = Number(searchParams.get("pageSize")) || 10;
	const pageCount = Math.ceil(totalCount / pageSize);
	const search = searchParams.get("search") || "";

	const [sortBy, setSortBy] = useState("id");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const rawFilters: Record<string, any> = {};
	searchParams.forEach((value, key) => {
		if (!["page", "pageSize", "search"].includes(key)) {
			rawFilters[key] = value;
		}
	});

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await fetchContactsAction({
					page,
					pageSize,
					search,
					rawFilters,
					step_id,
					sortBy,
					sortOrder,
				});

				if (!response.success) {
					setError(response.message);
				} else {
					setData(response.data);
					setTotalCount(response.totalCount);
				}
			} catch (e) {
				setError(e);
			}
		};

		fetch();
	}, [searchParams, sortBy, sortOrder]);

	if (error) return <ErrorMessage response={error} />;
	const refreshData = async () => {
		try {
			const response = await fetchContactsAction({
				page,
				pageSize,
				search,
				rawFilters,
				step_id,
				sortBy,
				sortOrder,
			});
			if (response.success) {
				setData(response.data);
				setTotalCount(response.totalCount);
			} else {
				setError(response.message);
			}
		} catch (e) {
			setError(e);
		} finally {
			router.refresh();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="ml-4">
					<Mail className="mr-2 h-4 w-4" />
					View contacts on the step
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] min-h-[90vh] min-w-[90vw] max-w-[90vw] overflow-auto">
				<DialogHeader>
					<DialogTitle>Manage contacts on this step</DialogTitle>
				</DialogHeader>
				<DataTable
					data={data}
					columns={columns}
					step_id={step_id}
					refreshData={refreshData}
					table_name="contacts"
					table_title="Contacts"
					mass_actions={MassActionsContacts}
					pagination={{ page, pageSize, total: totalCount, pageCount }}
					createDialog={createContactDialog}
					session={undefined}
					sorting={{ sortBy, sortOrder }}
					setSorting={({ sortBy, sortOrder }) => {
						setSortBy(sortBy);
						setSortOrder(sortOrder);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}

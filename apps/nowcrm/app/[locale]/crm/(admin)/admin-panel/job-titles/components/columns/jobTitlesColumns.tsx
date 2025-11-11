"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { FaRegTrashCan } from "react-icons/fa6";
import { SortableHeader } from "@/components/dataTable/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactJobTitle } from "@nowcrm/services";
import EditJobTitleDialog from "./editDialog";

const DeleteAction: React.FC<{ jobTitle: ContactJobTitle }> = ({ jobTitle }) => {
	const t = useMessages();

	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<FaRegTrashCan className="h-4 w-4 cursor-pointer" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={async () => {
						const { default: toast } = await import("react-hot-toast");
						const { deleteJobTitleAction } = await import("./deleteJobTitle");
						const res = await deleteJobTitleAction(jobTitle.documentId);
						if(!res.success) {
							toast.error(res.errorMessage ?? "Failed to delete job title");
							return;
						}
						toast.success(t.common.actions.delete);
						router.refresh();
					}}
				>
					{t.common.actions.confirm}
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">
					{t.common.actions.cancel}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<ContactJobTitle>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
	},
	{
		id: "edit",
		header: "Edit",
		cell: ({ row }) => {
			const jobTitle = row.original;
			return <EditJobTitleDialog jobTitle={jobTitle} />;
		},
	},
	{
		id: "delete",
		header: "Delete",
		cell: ({ row }) => {
			const jobTitle = row.original;
			return <DeleteAction jobTitle={jobTitle} />;
		},
	},
];

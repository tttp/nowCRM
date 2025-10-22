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
import type { ContactSalutation } from "@/lib/types/new_type/contact_salutation";
import EditContactSalutationDialog from "./editDialog";

const DeleteAction: React.FC<{ contactSalutation: ContactSalutation }> = ({
	contactSalutation,
}) => {
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
						const { deleteContactSalutationAction } = await import(
							"./deleteContactSalutation"
						);
						await deleteContactSalutationAction(contactSalutation.id);
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

export const columns: ColumnDef<ContactSalutation>[] = [
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
			const contactSalutation = row.original;
			return (
				<EditContactSalutationDialog contactSalutation={contactSalutation} />
			);
		},
	},
	{
		id: "delete",
		header: "Delete",
		cell: ({ row }) => {
			const contactSalutation = row.original;
			return <DeleteAction contactSalutation={contactSalutation} />;
		},
	},
];

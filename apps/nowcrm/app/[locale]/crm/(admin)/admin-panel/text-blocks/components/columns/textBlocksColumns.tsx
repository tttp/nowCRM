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
import { TextBlock } from "@nowcrm/services";
import EditTextBlockDialog from "./editDialog";

const DeleteAction: React.FC<{ textblock: TextBlock }> = ({ textblock }) => {
	const t = useMessages().Admin.TextBlock;
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
						const { deleteTextBlock } = await import("./deleteTextBlock");
						const res = await deleteTextBlock(textblock.documentId);
						if(!res.success) {
							toast.error(res.errorMessage || "Failed to delete text block");
							return;
						}
						toast.success(t.toast.delete);
						router.refresh();
					}}
				>
					{t.action.confirm}
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">
					{t.action.cancel}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<TextBlock>[] = [
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
		accessorKey: "text",
		header: "Text",
	},
	{
		id: "edit",
		header: "Edit",
		cell: ({ row }) => {
			return <EditTextBlockDialog textBlockName={row.original.name} />;
		},
	},
	{
		id: "delete",
		header: "Delete",
		cell: ({ row }) => {
			const textblock = row.original;
			return <DeleteAction textblock={textblock} />;
		},
	},
];

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
import { Tag } from "@nowcrm/services";

const DeleteAction: React.FC<{ tag: Tag }> = ({ tag }) => {
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
						const { deleteTag } = await import("./deleteTag");
						const res = await deleteTag(tag.documentId);
						if(!res.success) {
							toast.error(res.errorMessage ?? "Failed to delete tag");
							return;
						}
						toast.success(t.Admin.MediaType.toast.delete);
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

export const columns: ColumnDef<Tag>[] = [
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
		accessorKey: "color",
		header: "Color",
		cell: ({ row }) => {
			const color = row.original.color;
			if (!color) {
				return <span className="text-muted-foreground text-sm">No color</span>;
			}

			return (
				<div className="flex items-center gap-2">
					<div
						className="h-5 w-5 rounded-full border"
						style={{ backgroundColor: color }}
					/>
				</div>
			);
		},
	},

	{
		id: "delete",
		header: "Delete",
		cell: ({ row }) => {
			const tag = row.original;
			return <DeleteAction tag={tag} />;
		},
	},
];

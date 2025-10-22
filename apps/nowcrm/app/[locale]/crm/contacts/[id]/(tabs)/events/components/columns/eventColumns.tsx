"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type React from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { SortableHeader } from "@/components/dataTable/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTimeStrapi } from "@/lib/strapiDate";
import type { Event } from "@/lib/types/new_type/event";

const DeleteAction: React.FC<{ event: Event }> = ({ event }) => {
	const router = useRouter();
	const t = useTranslations();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<FaRegTrashCan className="h-4 w-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={async () => {
						const { default: toast } = await import("react-hot-toast");
						const { deleteEventAction } = await import("./deleteEvent");
						await deleteEventAction(event.id);
						toast.success(t("Contacts.events.eventDeleted"));
						router.refresh();
					}}
				>
					{t("common.actions.confirm")}
				</DropdownMenuItem>
				<DropdownMenuItem>{t("common.actions.cancel")}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<Event>[] = [
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
		accessorKey: "title",
		header: ({ column }) => <SortableHeader column={column} label="Title" />,
	},
	{
		accessorKey: "action",
		header: "Action",
	},
	{
		accessorKey: "external_id",
		header: "External id",
	},
	{
		accessorKey: "source",
		header: ({ column }) => <SortableHeader column={column} label="Source" />,
	},
	{
		accessorKey: "contact",
		header: ({ column }) => <SortableHeader column={column} label="Contact" />,
		cell: ({ row }) => {
			return <div>{row.original.contact?.email}</div>;
		},
	},
	{
		accessorKey: "click_count",
		header: "Click count",
		cell: ({ row }) => {
			const count = row.original.click_count;
			return count ? <div className="text-center">{count}</div> : null;
		},
	},
	{
		accessorKey: "open_count",
		header: "Open count",
		cell: ({ row }) => {
			const count = row.original.open_count;
			return count ? <div className="text-center">{count}</div> : null;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
	},
	{
		accessorKey: "destination",
		header: "Destination",
	},
	{
		accessorKey: "composition",
		header: ({ column }) => (
			<SortableHeader column={column} label="Composition" />
		),
		cell: ({ row }) => {
			const locale = useLocale();
			const compItem = row.original.composition_item;
			const composition = compItem?.composition;
			const channel = compItem?.channel;

			if (!compItem || !composition) return null;

			return (
				<a
					href={`/${locale}/crm/composer/${composition.id}#${channel?.name?.toLowerCase() ?? "overview"}`}
					className="text-blue-600 underline hover:text-blue-800"
				>
					{composition.name ?? composition.id}
				</a>
			);
		},
	},
	{
		accessorKey: "step_id",
		header: "Step id",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "payload",
		header: "Payload",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Created At" />
		),
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.createdAt)}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Updated At" />
		),
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.updatedAt)}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		id: "delete",
		cell: ({ row }) => {
			const event = row.original;
			return <DeleteAction event={event} />;
		},
	},
];

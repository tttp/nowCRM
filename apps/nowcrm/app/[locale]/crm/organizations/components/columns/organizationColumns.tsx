"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SortableHeader } from "@/components/dataTable/SortableHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { formatDateTimeStrapi } from "@/lib/strapiDate";
import type { Organization } from "@nowcrm/services";
import { TagsCell } from "../../../contacts/components/columns/tags/TagCell";
import { TagFilterHeader } from "../../../contacts/components/columns/tags/TagFilterHeader";


const ViewActions: React.FC<{ organization: Organization }> = ({
	organization,
}) => {
	const router = useRouter();

	return (
		<div className="text-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<Link
						href={`${RouteConfig.organizations.single.base(organization.documentId)}`}
					>
						<DropdownMenuItem>View organization</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={async () => {
							const { duplicateOrganizationAction } = await import(
								"@/lib/actions/organizations/duplicate-organization"
							);
							const res = await duplicateOrganizationAction(organization.documentId);
							if (!res.success) {
								toast.error(
									res.errorMessage ?? "Failed to duplicate organization",
								);
								return;
							}
							toast.success("Organization duplicated");
							router.refresh();
						}}
					>
						Duplicate
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={async () => {
							const { deleteOrganizationAction } = await import(
								"@/lib/actions/organizations/delete-organization"
							);
							const res = await deleteOrganizationAction(organization.documentId);
							if (!res.success) {
								toast.error(res.errorMessage ?? "Failed to delete organization");
								return;
							}
							toast.success("Organization deleted");
							router.refresh();
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const columns: ColumnDef<Organization>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex h-full items-center">
				<Checkbox
					className="leading-0"
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex h-full items-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Created" />,
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.createdAt)}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => <SortableHeader column={column} label="Updated" />,
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.updatedAt)}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		enableHiding: false,
		cell: ({ row, cell }) => {
			const organization = row.original;
			return (
				<Link
					href={`${RouteConfig.organizations.single.base(organization.documentId)}`}
					className="whitespace-nowrap font-medium hover:underline"
				>
					{cell.renderValue() as any}
				</Link>
			);
		},
	},
	{
		accessorKey: "organization_type",
		header: "Organization Type",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.organization_type?.name}</div>;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "tags",
		header: () => <TagFilterHeader />,
		cell: ({ row }) => {
			const tags = row.original.tags || [];
			return (
				<TagsCell
					serviceName="organizationsService"
					entityId={row.original.documentId}
					initialTags={tags}
				/>
			);
		},
	},
	{
		accessorKey: "contact_person",
		header: ({ column }) => (
			<SortableHeader column={column} label="Contact Person" />
		),
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "address_line1",
		header: "Address line",
	},

	{
		accessorKey: "location",
		header: ({ column }) => <SortableHeader column={column} label="Location" />,
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "contacts",
		header: "Contacts",
		cell: ({ row }) => {
			const organization = row.original;
			const names = organization.contacts
				.map((item) => item.first_name)
				.join(", ");
			return <p>{names}</p>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "frequency",
		header: "Frequency",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.frequency?.name}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "media_type",
		header: "Media Type",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.media_type?.name}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "zip",
		header: "ZIP",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "canton",
		header: ({ column }) => <SortableHeader column={column} label="Canton" />,
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "country",
		header: ({ column }) => <SortableHeader column={column} label="Country" />,
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "url",
		header: "URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "twitter_url",
		header: "Twitter(X) URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "facebook_url",
		header: "Facebook URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "whatsapp_channel",
		header: "Whatsapp Channel",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "linkedin_url",
		header: "Linkedin URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "telegram_url",
		header: "Telegram URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "telegram_channel",
		header: "Telegram Channel",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "instagram_url",
		header: "Instagram URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "tiktok_url",
		header: "TikTok URL",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "whatsapp_phone",
		header: "WhatsApp Phone",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "phone",
		header: "Phone",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "tag",
		header: "Tag",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "language",
		header: "Language",
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "sources",
		header: "Sources",
		cell: ({ row }) => {
			const organization = row.original;
			const names = organization.sources.map((item) => item.name).join(", ");
			return <p>{names}</p>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		accessorKey: "industry",
		header: "Industry",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.industry?.name}</div>;
		},
		meta: {
			hidden: true,
		},
	},
	{
		id: "actions",
		header: ({ column }) => <div className="text-center">Actions</div>,
		cell: ({ row }) => {
			const contact = row.original;
			return <ViewActions organization={contact} />;
		},
	},
];

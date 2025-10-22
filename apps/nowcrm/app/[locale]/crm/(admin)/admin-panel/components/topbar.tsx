"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMessages } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { cn } from "@/lib/utils";

export default function TopBarAdmin() {
	const t = useMessages().Admin.Layout.TopBar;
	const pathname = usePathname();

	// Regular links
	const regularNavItems = [
		{
			title: t.channels,
			href: RouteConfig.admin.admin_panel.channels,
		},
		{
			title: t.identities,
			href: RouteConfig.admin.admin_panel.identities,
		},
		{
			title: t.industry,
			href: RouteConfig.admin.admin_panel.industry,
		},
		{
			title: t.unipile_indetities,
			href: RouteConfig.admin.admin_panel.unipile_identities,
		},
		{
			title: t.text_blocks,
			href: RouteConfig.admin.admin_panel.text_blocks,
		},
	];

	// Organization group links
	const taxonomyNavItems = [
		{
			title: t.organization_type,
			href: RouteConfig.admin.admin_panel.organization.organization_type,
		},
		{
			title: t.media_type,
			href: RouteConfig.admin.admin_panel.organization.media_type,
		},
		{
			title: t.frequency,
			href: RouteConfig.admin.admin_panel.organization.frequency,
		},
		{
			title: t.action_type,
			href: RouteConfig.admin.admin_panel.action_types,
		},
		{
			title: t.tags,
			href: RouteConfig.admin.admin_panel.tags,
		},
		{
			title: t.job_titles,
			href: RouteConfig.admin.admin_panel.job_titles,
		},
		{
			title: t.contact_titles,
			href: RouteConfig.admin.admin_panel.contact_titles,
		},
		{
			title: t.contact_salutations,
			href: RouteConfig.admin.admin_panel.contact_salutations,
		},
		{
			title: t.campaigns,
			href: RouteConfig.admin.admin_panel.campaigns,
		},
		{
			title: t.campaign_categories,
			href: RouteConfig.admin.admin_panel.campaign_categories,
		},
	];

	// Check if any organization link is active
	const isOrganizationActive = taxonomyNavItems.some((item) =>
		pathname.includes(item.href),
	);

	return (
		<nav>
			<div className="overflow-x-auto">
				<div className="flex min-w-max space-x-2 px-2">
					{/* Regular links */}
					{regularNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"transition-colors",
								pathname.includes(item.href)
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:text-muted-foreground",
							)}
						>
							{item.title}
						</Link>
					))}

					{/* Organization dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className={cn(
								buttonVariants({ variant: "ghost" }),
								isOrganizationActive
									? "bg-muted text-foreground "
									: "text-muted-foreground hover:text-muted-foreground",
							)}
						>
							{t.taxonomy} <ChevronDown className="ml-1 h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{taxonomyNavItems.map((item) => (
								<DropdownMenuItem key={item.href} asChild>
									<Link
										href={item.href}
										className={cn(
											"w-full",
											pathname.includes(item.href)
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-muted-foreground",
										)}
									>
										{item.title}
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}

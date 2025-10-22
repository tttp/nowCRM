// contactsapp/components/topbar/userMenu.tsx

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth, signOut } from "@/auth";
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { getInitials } from "@/lib/getInitials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default async function UserMenu({ className }: { className?: string }) {
	const session = await auth();
	const t = await getTranslations("TopBar");
	const initials = getInitials(session?.user?.username as string);

	// Check if the user is an Admin
	// const isAdmin = session?.user?.role === 'admin'

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-9 w-9 rounded-full">
						<Avatar className="h-9 w-9 border">
							<AvatarImage src={session?.user?.image as string} alt="@shadcn" />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-medium text-sm leading-none">
								{session?.user?.username as string}
							</p>
							<p className="text-muted-foreground text-xs leading-none">
								{session?.user?.email as string}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<Link href={RouteConfig.user.profile}>
							<DropdownMenuItem className="cursor-pointer">
								{t("profile")}
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
						<Link href={RouteConfig.user.settings} hidden>
							<DropdownMenuItem className="cursor-pointer" hidden>
								{t("settings")}
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
						<Link href={RouteConfig.admin.admin_panel.channels}>
							<DropdownMenuItem className="cursor-pointer">
								{t("admin_panel")}
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<form
						action={async () => {
							"use server";
							await signOut({ redirectTo: RouteConfig.auth.login });
						}}
					>
						<button type="submit" className="w-full">
							<DropdownMenuItem className="cursor-pointer">
								{t("exit")}
								<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
							</DropdownMenuItem>
						</button>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

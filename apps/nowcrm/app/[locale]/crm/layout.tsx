// contactsapp/app/[locale]/crm/layout.tsx

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/footer";
import Spinner from "@/components/Spinner";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import NavigationLinks from "@/components/topbar/navigationLinks";
import UserMenu from "@/components/topbar/userMenu";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex">
			<div className="flex min-h-screen grow flex-col ">
				<div className="top-0 right-0 left-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 py-0">
					{/* Left section: Logo and Navigation */}
					<div className="flex h-full items-center gap-4">
						<Link className="flex h-full items-center border-r pr-4" href="/">
							<Image
								src="/nowcrm-black-red.svg"
								width={90}
								height={90}
								alt="nowCRM"
								className="mr-1 block object-contain dark:hidden"
							/>
							<Image
								src="/nowcrm-white-red.svg"
								width={90}
								height={90}
								alt="nowCRM"
								className="mr-1 hidden object-contain dark:block"
							/>
						</Link>
						<NavigationLinks />
					</div>

					{/* Right section: Notifications, ThemeSwitcher, and UserMenu */}
					<div className="flex items-center gap-4">
						<Suspense fallback={<Spinner size="medium" />}>
							{/* Uncomment and add your NotificationBell component when ready */}
							{/* <NotificationBellNew session={session as Session} /> */}
						</Suspense>
						<ThemeSwitcher />
						<UserMenu className="flex content-center" />
					</div>
				</div>
				<main className="grow overflow-auto">{children}</main>
				<Footer />
			</div>
		</div>
	);
}

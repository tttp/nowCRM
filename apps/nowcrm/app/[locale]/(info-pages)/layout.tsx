import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import NavigationLinks from "@/components/topbar/navigationLinks";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Header / Topbar */}
			<header className="sticky top-0 right-0 left-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 py-2">
				{/* Left section: Logo and Top Navigation */}
				<div className="flex items-center gap-4">
					<Link href="/">
						<Image
							src="/nowcrm-black-red.svg"
							width={90}
							height={90}
							alt="nowCRM"
							className="block object-contain dark:hidden"
						/>
						<Image
							src="/nowcrm-white-red.svg"
							width={90}
							height={90}
							alt="nowCRM"
							className="hidden object-contain dark:block"
						/>
					</Link>
					<NavigationLinks usePublic={true} />
				</div>
				{/* Right section: ThemeSwitcher, etc. */}
				<div className="flex items-center gap-4">
					<ThemeSwitcher />
				</div>
			</header>

			{/* Main content area with bottom margin to prevent overlap with bottom nav */}
			<main className="mb-16 grow overflow-auto">{children}</main>

			{/* Bottom Navigation (always visible) */}
			<Footer />
		</div>
	);
}

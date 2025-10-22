import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import BottomNavigationLinks from "@/components/bottomBar/bottomNavigationLinks";
import { RouteConfig } from "@/lib/config/RoutesConfig";
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Auth.Layout");
	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
	};
}

// Layout for login
export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (session?.user) {
		return redirect(RouteConfig.home);
	}
	return (
		<>
			{children}
			<BottomNavigationLinks />
		</>
	);
}

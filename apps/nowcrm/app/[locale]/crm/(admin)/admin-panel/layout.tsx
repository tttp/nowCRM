import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import TopBarAdmin from "./components/topbar";

interface LayoutProps {
	children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "admin panel",
		description: "admin panel",
	};
}

export default async function Layout({ children }: LayoutProps) {
	const t = await getTranslations("Admin.Layout");

	return (
		<div className="container mt-2">
			<header>
				<h1 className="mb-2 font-bold text-3xl">{t("Panel")}</h1>
			</header>
			<TopBarAdmin />
			<Separator className="my-2" />
			<main>{children}</main>
		</div>
	);
}

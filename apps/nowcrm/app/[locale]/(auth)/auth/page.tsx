import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
// contactsapp/app/[locale]/(auth)/auth/page.tsx
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { LoginForm } from "./components/loginForm";

export default async function AuthenticationPage() {
	const t = await getTranslations("Auth");

	return (
		<>
			<Card className="border-0 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="font-bold text-2xl tracking-tight">
						{t("Login.header.title")}
					</CardTitle>
					<CardDescription>{t("Login.header.subtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<LoginForm />
					</div>
				</CardContent>
			</Card>
			<p className="px-8 text-center text-muted-foreground text-sm">
				{t("common.termsAndPrivacy.agreementLogin")}{" "}
				<Link
					href={RouteConfig.terms}
					className="underline underline-offset-4 hover:text-primary"
				>
					{t("common.termsAndPrivacy.terms")}
				</Link>{" "}
				{t("common.termsAndPrivacy.and")}{" "}
				<Link
					href={RouteConfig.policy.base}
					className="underline underline-offset-4 hover:text-primary"
				>
					{t("common.termsAndPrivacy.policy")}
				</Link>
			</p>
		</>
	);
}

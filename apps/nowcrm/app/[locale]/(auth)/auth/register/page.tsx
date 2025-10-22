import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { RegisterUserForm } from "./components/registerForm";

export default async function RegisterPage() {
	const t = await getTranslations("Auth");

	return (
		<>
			<Card className="border-0 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="font-bold text-2xl tracking-tight">
						{t("Register.header.title")}
					</CardTitle>
					<CardDescription>{t("Register.header.subtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<RegisterUserForm />
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
						</div>
						<div className="text-center">
							<p className="text-muted-foreground text-sm">
								{t("Register.footer")}{" "}
								<Link
									href={RouteConfig.auth.login}
									className="font-medium text-primary hover:underline"
								>
									{t("common.signIn")}
								</Link>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<p className="px-8 text-center text-muted-foreground text-sm">
				{t("common.termsAndPrivacy.agreementRegister")}{" "}
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

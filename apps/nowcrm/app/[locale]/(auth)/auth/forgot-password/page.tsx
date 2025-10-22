// contactsapp/app/[locale]/(auth)/auth/forgot-password/page.tsx

import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "../components/forgotPasswordForm";

export default async function Page() {
	const t = await getTranslations();

	return (
		<Card className="border-0 shadow-lg">
			<CardHeader className="space-y-1">
				<CardTitle className="font-bold text-2xl tracking-tight">
					{t("Auth.ForgotPassword.header.title")}
				</CardTitle>
				<CardDescription>
					{t("Auth.ForgotPassword.header.subtitle")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
			</CardContent>
		</Card>
	);
}

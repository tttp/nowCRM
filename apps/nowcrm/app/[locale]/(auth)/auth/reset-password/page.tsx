// contactsapp/app/[locale]/(auth)/auth/reset-password/page.tsx

import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "../components/resetPasswordForm";

export default async function Page() {
	const t = await getTranslations();

	return (
		<Card className="border-0 shadow-lg">
			<CardHeader className="space-y-1">
				<CardTitle className="font-bold text-2xl tracking-tight">
					{t("Auth.ResetPassword.header.title")}
				</CardTitle>
				<CardDescription>
					{t("Auth.ResetPassword.header.subtitle")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResetPasswordForm />
			</CardContent>
		</Card>
	);
}

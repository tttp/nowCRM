// contactsapp/app/[locale]/(auth)/auth/verify-otp/page.tsx

import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { VerifyOtpForm } from "./components/verifyOtpFom";

export default async function Page() {
	const t = await getTranslations("Auth");
	return (
		<Card className="border-0 shadow-lg">
			<CardHeader className="space-y-1">
				<CardTitle className="font-bold text-2xl tracking-tight">
					{t("VerifyOtp.header.title")}
				</CardTitle>
				<CardDescription>{t("VerifyOtp.header.subtitle")}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-6">
					<VerifyOtpForm />
				</div>
			</CardContent>
		</Card>
	);
}

import { AlertCircle, Mail, Settings, UserX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RouteConfig } from "@/lib/config/RoutesConfig";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Auth.Layout");
	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
	};
}

type ErrorKey = "Configuration" | "AccessDenied" | "Verification" | "Default";

const errorIcons: Record<ErrorKey, JSX.Element> = {
	Configuration: <Settings className="h-12 w-12 text-warning" />,
	AccessDenied: <UserX className="h-12 w-12 text-destructive" />,
	Verification: <Mail className="h-12 w-12 text-primary" />,
	Default: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
};

// Type Guard Function
const isErrorKey = (key: string | null): key is ErrorKey => {
	return (
		key === "Configuration" ||
		key === "AccessDenied" ||
		key === "Verification" ||
		key === "Default"
	);
};

export default async function Unauthorized(props: {
	searchParams: Promise<{ error: string }>;
}) {
	const searchParams = await props.searchParams;
	const t = await getTranslations("Auth.Unauthorized");
	const error = searchParams.error;

	// Safely determine the errorKey
	const errorKey: ErrorKey = isErrorKey(error) ? error : "Default";

	// Get translations for error messages
	const title = t(`errors.${errorKey}.title`);
	const message = t(`errors.${errorKey}.message`);
	const icon = errorIcons[errorKey];

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mb-4 flex justify-center">{icon}</div>
					<CardTitle className="font-bold text-2xl">{title}</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-muted-foreground">{message}</p>
					{error && (
						<p className="mt-2 text-muted-foreground text-sm">
							{t("errorCode", { error })}
						</p>
					)}
				</CardContent>
				<CardFooter className="flex flex-col space-y-2">
					<p className="text-center text-muted-foreground text-sm">
						{t("contactAdmin")}
					</p>
					<Button className="w-full" asChild>
						<Link href={RouteConfig.auth.login}>{t("returnToLogin")}</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

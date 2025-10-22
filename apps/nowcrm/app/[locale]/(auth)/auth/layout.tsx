import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type React from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getTranslations("Auth");
	return (
		<div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
			<div className="absolute top-4 right-4 z-50">
				<ThemeSwitcher />
			</div>
			<div className="flex flex-col items-start justify-start bg-muted p-10">
				<div className="flex flex-col items-start space-y-4">
					<Image
						src="/nowcrm-black-red.svg"
						width={90}
						height={90}
						alt={t("Register.metaTitle")}
						className="block object-contain dark:hidden"
					/>
					<Image
						src="/nowcrm-white-red.svg"
						width={90}
						height={90}
						alt={t("Register.metaTitle")}
						className="hidden object-contain dark:block"
					/>
				</div>
			</div>
			<div className="flex w-full items-center justify-center p-8">
				<div className="w-full max-w-md space-y-6">{children}</div>
			</div>
		</div>
	);
}

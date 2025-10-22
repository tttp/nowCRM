"use client";

import { AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionResultProps {
	type: "success" | "error" | "info";
	title?: string;
	description?: string;
	returnUrl?: string;
	returnText?: string;
	className?: string;
}

export default function ActionResult({
	type = "info",
	description,
	returnUrl = "/",
	returnText = "Return Home",
	className,
}: ActionResultProps) {
	// Set defaults based on type
	let icon: ReactNode;
	let styles: {
		icon: string;
		content: string;
	};

	switch (type) {
		case "success":
			icon = <CheckCircle className="h-12 w-12" />;
			styles = {
				icon: "text-green-500 dark:text-green-400",
				content: "text-green-700 dark:text-green-300",
			};
			break;
		case "error":
			icon = <AlertCircle className="h-12 w-12" />;
			styles = {
				icon: "text-red-500 dark:text-red-400",
				content: "text-red-700 dark:text-red-300",
			};
			break;
		default: // info
			icon = <Info className="h-12 w-12" />;
			styles = {
				icon: "text-blue-500 dark:text-blue-400",
				content: "text-blue-700 dark:text-blue-300",
			};
	}

	return (
		<div className={cn("w-full text-center", className)}>
			<div className="mb-6">
				<div className={`mb-4 flex justify-center ${styles.icon}`}>{icon}</div>
				{description && <p className="text-muted-foreground">{description}</p>}
			</div>
			<div className="flex justify-center">
				<Button asChild>
					<Link href={returnUrl}>{returnText}</Link>
				</Button>
			</div>
		</div>
	);
}

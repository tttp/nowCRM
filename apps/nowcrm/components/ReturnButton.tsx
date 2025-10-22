"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReturnButtonProps {
	className?: string;
}
export function ReturnButton({ className }: ReturnButtonProps) {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			type="button"
			onClick={() => router.back()}
			className={cn("mr-4", className)}
		>
			<FaArrowLeft className="mr-2 h-4 w-4" />
			Back
		</Button>
	);
}

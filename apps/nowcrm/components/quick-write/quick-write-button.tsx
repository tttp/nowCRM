"use client";

import { Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuickWriteDialog } from "./quick-write-dialog";

interface QuickWriteButtonProps {
	onTextGenerated?: (text: string) => void;
	variant?: "default" | "outline" | "ghost" | "secondary";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
	initialTitle?: string;
	existingText?: string;
}

export function QuickWriteButton({
	onTextGenerated,
	variant = "outline",
	size = "sm",
	className,
	children,
	initialTitle = "",
	existingText = "",
}: QuickWriteButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleTextGenerated = (text: string) => {
		onTextGenerated?.(text);
		setIsOpen(false);
	};

	return (
		<>
			<Button
				variant={variant}
				size={size}
				onClick={() => setIsOpen(true)}
				className={className}
			>
				{children || (
					<>
						<Zap className="mr-2 h-4 w-4" />
						Quick Write
					</>
				)}
			</Button>

			<QuickWriteDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				onTextGenerated={handleTextGenerated}
				initialTitle={initialTitle}
				existingText={existingText}
			/>
		</>
	);
}

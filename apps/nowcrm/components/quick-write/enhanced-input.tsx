"use client";

import type React from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { QuickWriteButton } from "./quick-write-button";

interface EnhancedInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	showQuickWrite?: boolean;
	onValueChange?: (value: string) => void;
	quickWriteTitle?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
	(
		{
			className,
			showQuickWrite = true,
			onValueChange,
			onChange,
			quickWriteTitle = "",
			value,
			...props
		},
		ref,
	) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onValueChange?.(e.target.value);
			onChange?.(e);
		};

		const handleQuickWriteGenerated = (generatedText: string) => {
			// Replace the content for input fields
			const newValue = generatedText;

			// Create synthetic change event
			const syntheticEvent = {
				target: {
					value: newValue,
				},
			} as React.ChangeEvent<HTMLInputElement>;

			onChange?.(syntheticEvent);
			onValueChange?.(newValue);
		};

		return (
			<div className="relative">
				<Input
					ref={ref}
					className={cn("pr-12", className)}
					value={value}
					onChange={handleChange}
					{...props}
				/>
				{showQuickWrite && (
					<div className="-translate-y-1/2 absolute top-1/2 right-2">
						<QuickWriteButton
							onTextGenerated={handleQuickWriteGenerated}
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							initialTitle={quickWriteTitle}
							existingText={String(value || "")}
						>
							<span className="sr-only">Quick Write</span>✨
						</QuickWriteButton>
					</div>
				)}
			</div>
		);
	},
);

EnhancedInput.displayName = "EnhancedInput";

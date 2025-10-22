"use client";

import type React from "react";
import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { QuickWriteButton } from "./quick-write-button";

interface EnhancedTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	showQuickWrite?: boolean;
	onValueChange?: (value: string) => void;
	quickWriteTitle?: string;
}

export const EnhancedTextarea = forwardRef<
	HTMLTextAreaElement,
	EnhancedTextareaProps
>(
	(
		{
			className,
			showQuickWrite = true,
			onValueChange,
			onChange,
			quickWriteTitle = "",
			...props
		},
		ref,
	) => {
		// ❌ Remove local useState

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onValueChange?.(e.target.value);
			onChange?.(e); // Allow parent control to react
		};

		const handleQuickWriteGenerated = (generatedText: string) => {
			//const currentValue = (props.value || "") as string;
			const newValue = generatedText;

			// ✅ Fire onChange manually
			const syntheticEvent = {
				target: {
					value: newValue,
				},
			} as React.ChangeEvent<HTMLTextAreaElement>;

			onChange?.(syntheticEvent);
			onValueChange?.(newValue);
		};

		return (
			<div className="relative">
				<Textarea
					ref={ref}
					className={cn("pr-12", className)}
					value={props.value}
					onChange={handleChange}
					{...props}
				/>
				{showQuickWrite && (
					<div className="absolute top-2 right-2">
						<QuickWriteButton
							onTextGenerated={handleQuickWriteGenerated}
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							initialTitle={quickWriteTitle}
							existingText={String(props.value || "")}
						>
							<span className="sr-only">Quick Write</span>✨
						</QuickWriteButton>
					</div>
				)}
			</div>
		);
	},
);

EnhancedTextarea.displayName = "EnhancedTextarea";

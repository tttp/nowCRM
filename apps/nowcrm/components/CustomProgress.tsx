import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CustomProgressProps {
	value: number;
	brandColor?: string;
	variant?: "brand" | "theme" | "monochrome";
	className?: string;
}

export default function CustomProgress({
	value,
	brandColor,
	variant = "brand",
	className,
}: CustomProgressProps) {
	// Brand color variant
	if (variant === "brand" && brandColor) {
		return (
			<div
				className={cn(
					"relative h-1 w-full overflow-hidden rounded-none bg-secondary",
					className,
				)}
			>
				<div
					className="h-full w-full flex-1 transition-all duration-300 ease-in-out"
					style={{
						transform: `translateX(-${100 - value}%)`,
						backgroundColor: brandColor,
					}}
				/>
			</div>
		);
	}

	// Black/White based on theme
	if (variant === "monochrome") {
		return (
			<Progress
				value={value}
				className={cn("h-1 rounded-none [&>div]:bg-foreground", className)}
			/>
		);
	}

	// Custom theme-aware colors
	if (variant === "theme") {
		return (
			<Progress
				value={value}
				className={cn(
					"h-1 rounded-none [&>div]:bg-accent-foreground",
					className,
				)}
			/>
		);
	}

	// Default fallback
	return (
		<Progress value={value} className={cn("h-1 rounded-none", className)} />
	);
}

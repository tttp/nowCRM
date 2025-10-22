import { Pencil } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface HeaderBarProps {
	title: string;
	isActive: boolean;
	isEditing: boolean;
	isSave: boolean;
	onTitleChange: (value: string) => void;
	onTitleBlur: () => void;
	onEditToggle: (value: boolean) => void;
	onToggleActivation: () => void;
}

export function HeaderBar({
	title,
	isActive,
	isEditing,
	isSave,
	onTitleChange,
	onTitleBlur,
	onEditToggle,
	onToggleActivation,
}: HeaderBarProps) {
	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && titleInputRef.current) {
			titleInputRef.current.focus();
			titleInputRef.current.select();
		}
	}, [isEditing]);

	return (
		<div className="position-sticky top-0 z-50 flex h-16 items-center justify-between border-border border-b bg-card px-4">
			<div className="flex items-center gap-6">
				<div className="flex items-center">
					{isEditing ? (
						<div className="rounded-md border border-border bg-background px-2 py-1">
							<input
								ref={titleInputRef}
								type="text"
								value={title}
								onChange={(e) => onTitleChange(e.target.value)}
								onBlur={onTitleBlur}
								onKeyDown={(e) => {
									if (e.key === "Enter") onTitleBlur();
								}}
								className="border-none bg-transparent font-semibold text-foreground text-xl outline-none focus:ring-0"
							/>
						</div>
					) : (
						<div className="flex items-center">
							<h1 className="font-semibold text-foreground text-xl">{title}</h1>
							<button
								type="button"
								onClick={() => onEditToggle(true)}
								className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
							>
								<Pencil className="h-4 w-4" />
							</button>
						</div>
					)}
				</div>
				<span className="text-muted-foreground text-sm">
					{isActive ? (
						<span className="font-medium text-green-600 dark:text-green-400">
							Active
						</span>
					) : (
						"Draft"
					)}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					className={`flex items-center gap-1 ${
						isActive ? "bg-destructive hover:bg-destructive/90" : ""
					}`}
					onClick={onToggleActivation}
					disabled={isSave}
				>
					{isActive ? "Deactivate" : "Activate"}
				</Button>
			</div>
		</div>
	);
}

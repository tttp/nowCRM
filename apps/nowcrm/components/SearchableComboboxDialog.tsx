"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Option {
	code: string;
	name: string;
}

interface Props {
	value: string;
	onChange: (val: string) => void;
	options: Option[];
	placeholder?: string;
	disabled?: boolean;
}

export function SearchableComboboxDialog({
	value,
	onChange,
	options,
	placeholder = "Select...",
	disabled = false,
}: Props) {
	const [open, setOpen] = useState(false);
	const selected = options.find((opt) => opt.name === value) ?? null;

	return (
		<>
			<Button
				type="button"
				variant="outline"
				role="combobox"
				disabled={disabled}
				aria-expanded={open}
				className={cn(
					"w-full justify-between",
					disabled && "cursor-not-allowed text-muted-foreground",
				)}
				onClick={() => setOpen(true)}
			>
				{selected ? selected.name : placeholder}
			</Button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<div
					onKeyDown={(e) => {
						if (e.key === "Enter") e.stopPropagation();
					}}
					onMouseDown={(e) => e.stopPropagation()}
				>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
					/>
					<CommandList>
						<CommandEmpty>No match found.</CommandEmpty>
						<CommandGroup>
							{options.map((item) => (
								<CommandItem
									key={item.code}
									value={item.name}
									onSelect={() => {
										onChange(item.name);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											item.code === value ? "opacity-100" : "opacity-0",
										)}
									/>
									{item.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</div>
			</CommandDialog>
		</>
	);
}

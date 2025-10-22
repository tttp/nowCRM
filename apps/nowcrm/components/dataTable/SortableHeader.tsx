"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortableHeaderProps<TData> = {
	column: Column<TData, unknown>;
	label: string;
};

export function SortableHeader<TData>({
	column,
	label,
}: SortableHeaderProps<TData>) {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			className="h-auto p-0 font-semibold hover:bg-transparent"
		>
			{label}
			<ArrowUpDown className="h-4 w-4" />
		</Button>
	);
}

"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface TableColumn<T> {
	key: string;
	header: string;
	render?: (item: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
	data: T[];
	columns: TableColumn<T>[];
	searchKey?: string;
	searchPlaceholder?: string;
	itemsPerPage?: number;
	className?: string;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	totalItems?: number;
}

export function ReusableTable<T extends Record<string, any>>({
	data,
	columns,
	searchKey = "",
	// searchPlaceholder = "Search...",
	itemsPerPage = 5,
	className = "",
	currentPage,
	onPageChange,
	totalItems,
}: ReusableTableProps<T>) {
	const [internalPage, setInternalPage] = useState(1);
	const [searchQuery] = useState("");
	const [filteredData, setFilteredData] = useState<T[]>(data);

	const page = currentPage ?? internalPage;
	const setPage = onPageChange ?? setInternalPage;

	const resolvedTotalItems = totalItems ?? filteredData.length;
	const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / itemsPerPage));

	const filterData = useCallback(() => {
		if (!searchQuery.trim() || !searchKey) {
			return data;
		}

		return data.filter((item) => {
			if (searchKey === "*") {
				return Object.values(item).some(
					(value) =>
						typeof value === "string" &&
						value.toLowerCase().includes(searchQuery.toLowerCase()),
				);
			}

			const value = item[searchKey];
			if (typeof value === "string") {
				return value.toLowerCase().includes(searchQuery.toLowerCase());
			}
			return false;
		});
	}, [data, searchKey, searchQuery]);

	useEffect(() => {
		const newFilteredData = filterData();
		setFilteredData(newFilteredData);

		if (
			searchQuery !== "" ||
			Math.abs(data.length - filteredData.length) > itemsPerPage
		) {
			setPage(1);
		}
	}, [data, filterData, searchQuery, itemsPerPage]);

	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
	const currentItems = filteredData.slice(startIndex, endIndex);

	const goToFirstPage = useCallback(() => setPage(1), []);
	const goToPreviousPage = useCallback(
		() => setPage(Math.max(1, page - 1)),
		[page],
	);
	const goToNextPage = useCallback(
		() => setPage(Math.min(totalPages, page + 1)),
		[page, totalPages],
	);
	const goToLastPage = useCallback(() => setPage(totalPages), [totalPages]);

	return (
		<div className={`space-y-4 ${className}`}>
			<div className="overflow-x-auto rounded-md border">
				<table className="w-full min-w-full table-fixed">
					<thead>
						<tr className="border-b bg-muted/50">
							{columns.map((column) => (
								<th
									key={column.key}
									className="px-4 py-3 text-left font-medium text-muted-foreground text-sm"
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{currentItems.length > 0 ? (
							currentItems.map((item, index) => (
								<tr
									key={`row-${startIndex + index}`}
									className="border-b transition-colors hover:bg-muted/50"
								>
									{columns.map((column) => (
										<td
											key={`cell-${startIndex + index}-${column.key}`}
											className="px-4 py-3 text-sm"
										>
											{column.render ? column.render(item) : item[column.key]}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-6 text-center text-muted-foreground text-sm"
								>
									No results found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-muted-foreground text-sm">
					Rows per page: <span className="font-medium">{itemsPerPage}</span>
				</div>

				<div className="flex items-center justify-end space-x-2">
					<div className="text-muted-foreground text-sm">
						Page {page} of {totalPages}
					</div>
					<div className="flex items-center space-x-1">
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={goToFirstPage}
							disabled={page === 1}
						>
							<ChevronsLeft className="h-4 w-4" />
							<span className="sr-only">First page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={goToPreviousPage}
							disabled={page === 1}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={goToNextPage}
							disabled={page === totalPages}
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={goToLastPage}
							disabled={page === totalPages}
						>
							<ChevronsRight className="h-4 w-4" />
							<span className="sr-only">Last page</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

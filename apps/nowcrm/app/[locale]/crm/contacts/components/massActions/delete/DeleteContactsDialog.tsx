"use client";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteContactsDialog({
	selectedRows,
	count,
}: {
	selectedRows?: number[];
	count?: number;
}) {
	const howMany =
		typeof count === "number"
			? count
			: Array.isArray(selectedRows)
				? selectedRows.length
				: 0;

	return (
		<div>
			<DialogHeader>
				<DialogTitle>Mass Contact Deletion</DialogTitle>
				<DialogDescription>
					You are about to delete {howMany} contacts. Are you sure?
				</DialogDescription>
			</DialogHeader>
		</div>
	);
}

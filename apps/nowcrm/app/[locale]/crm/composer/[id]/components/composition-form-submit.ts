"use server";

import { compositionItemsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
export async function processFormFileOperations(
	formData: FormData,
): Promise<void> {
	const session = await auth();

	const compositionItemsJson = formData.get("composition_items");
	if (!compositionItemsJson || typeof compositionItemsJson !== "string") {
		throw new Error("Missing composition items data");
	}

	const compositionItems = JSON.parse(compositionItemsJson);

	const fileOperationPromises = compositionItems.map(
		async (item: any, index: number) => {
			if (!item.id) return;

			// Get files to delete (stored as JSON string)
			const fileIdsToDelete = item.files_to_delete
				? typeof item.files_to_delete === "string"
					? JSON.parse(item.files_to_delete)
					: item.files_to_delete
				: [];

			const itemFiles: File[] = [];
			// Files are stored with keys like "item_0_file_0", "item_0_file_1", etc.
			let fileIndex = 0;
			let file = formData.get(`item_${index}_file_${fileIndex}`);
			while (file instanceof File) {
				itemFiles.push(file);
				fileIndex++;
				file = formData.get(`item_${index}_file_${fileIndex}`);
			}

			if (itemFiles.length > 0 || fileIdsToDelete.length > 0) {
				await Promise.all([
					itemFiles.length > 0
						? (async () => {
								await compositionItemsService.uploadFile(itemFiles, item.documentId, session?.jwt);
							})()
						: Promise.resolve(),

					fileIdsToDelete.length > 0
						? (async () => {
								const filesUpdated = item.attached_files
									?.filter(
										(file: any) =>
											!fileIdsToDelete.includes(file.id) && !file.isNew,
									)
									.map((file: any) => file.id);
								console.log(filesUpdated);
								await compositionItemsService.update(item.documentId, {
									attached_files: filesUpdated,
								}, session?.jwt);
							})()
						: Promise.resolve(),
				]);
			}
		},
	);

	await Promise.all(fileOperationPromises);
}

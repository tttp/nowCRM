"use client";

import { FileUp, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FileUploadHandlerProps {
	onFileSelect: (files: File[]) => void;
	maxFiles?: number;
	acceptedFileTypes?: string;
}

export function FileUploadHandler({
	onFileSelect,
	maxFiles = 5,
	acceptedFileTypes = "*",
}: FileUploadHandlerProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [open, setOpen] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;

		const newFiles = Array.from(e.target.files);

		if (selectedFiles.length + newFiles.length > maxFiles) {
			toast.error(`You can only upload a maximum of ${maxFiles} files`);
			return;
		}

		setSelectedFiles((prev) => [...prev, ...newFiles]);
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		onFileSelect(selectedFiles);
		setOpen(false);
		setSelectedFiles([]);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" type="button">
					<FileUp className="mr-2 h-4 w-4" />
					Upload Files
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Upload Attachments</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="flex w-full items-center justify-center">
						<label
							htmlFor="file-upload"
							className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:hover:bg-bray-800"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<FileUp className="mb-3 h-8 w-8 text-gray-500" />
								<p className="mb-2 text-gray-500 text-sm">
									<span className="font-semibold">Click to upload</span> or drag
									and drop
								</p>
								<p className="text-gray-500 text-xs">
									{maxFiles - selectedFiles.length} file(s) remaining
								</p>
							</div>
							<Input
								id="file-upload"
								type="file"
								multiple
								accept={acceptedFileTypes}
								className="hidden"
								onChange={handleFileChange}
							/>
						</label>
					</div>

					{selectedFiles.length > 0 && (
						<div className="space-y-2">
							<h3 className="font-medium text-sm">Selected Files</h3>
							<div className="max-h-40 space-y-2 overflow-y-auto">
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-md border p-2"
									>
										<div className="flex-1 truncate text-sm">{file.name}</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeFile(index)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								setSelectedFiles([]);
							}}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={selectedFiles.length === 0}
						>
							Add files
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

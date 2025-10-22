"use client";

import { FileWarning, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
	onImageSelect: (file: File) => void;
	className?: string;
	maxSize?: number; // in MB
	label?: string;
	currentImage?: string | null;
	onRemoveImage?: () => void;
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function ImageUploader({
	onImageSelect,
	className,
	maxSize = 5, // Default 5MB
	label = "Upload Image",
	currentImage,
	onRemoveImage,
}: ImageUploaderProps) {
	const [error, setError] = useState<string>("");
	const [fileInfo, setFileInfo] = useState<{
		name: string;
		size: number;
	} | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		currentImage as any,
	);

	const validateFile = (file: File) => {
		// Check if file is an image
		if (!file.type.startsWith("image/")) {
			return "File must be an image";
		}

		// Check file size
		if (file.size > maxSize * 1024 * 1024) {
			return `Image size must be less than ${maxSize}MB`;
		}

		return null;
	};

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (!file) return;

			setError("");
			setFileInfo({ name: file.name, size: file.size });

			const validationError = validateFile(file);
			if (validationError) {
				setError(validationError);
				return;
			}

			// Create a preview URL for display purposes only
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);

			// Pass the file to the parent component without uploading
			onImageSelect(file);
		},
		[onImageSelect],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
		},
		multiple: false,
	});

	const handleRemove = () => {
		setPreviewUrl(null);
		setFileInfo(null);
		if (onRemoveImage) {
			onRemoveImage();
		}
	};

	return (
		<div className={cn("w-full", className)}>
			{previewUrl ? (
				<div className="relative overflow-hidden rounded-md border">
					<img
						src={previewUrl || "/placeholder.svg"}
						alt="Preview"
						className="h-auto max-h-[200px] w-full object-cover"
					/>
					<div className="absolute top-2 right-2">
						<Button variant="destructive" size="sm" onClick={handleRemove}>
							Remove
						</Button>
					</div>
					<div className="bg-background p-2">
						{fileInfo && (
							<div className="text-sm">
								<p className="truncate font-medium">{fileInfo.name}</p>
								<p className="text-muted-foreground">
									{formatFileSize(fileInfo.size)}
								</p>
							</div>
						)}
					</div>
				</div>
			) : (
				<div
					{...getRootProps()}
					className={cn(
						"cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors",
						isDragActive
							? "border-primary bg-primary/5"
							: "border-muted-foreground/25",
						error ? "border-destructive" : "",
					)}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center space-y-2">
						{error ? (
							<div className="space-y-1">
								<div className="flex items-center justify-center space-x-1">
									<FileWarning className="h-4 w-4 text-destructive" />
									<p className="font-medium text-destructive text-sm">
										{error}
									</p>
								</div>
								<p className="text-muted-foreground text-xs">
									Please try again with a valid image file
								</p>
							</div>
						) : (
							<>
								<Upload className="h-6 w-6 text-primary" />
								<p className="font-medium text-sm">
									{isDragActive ? "Drop your image here" : label}
								</p>
								<p className="text-muted-foreground text-xs">
									or click to select a file
								</p>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

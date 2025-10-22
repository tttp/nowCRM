"use client";

import {
	CircleHelp,
	ExternalLink,
	ImageIcon,
	Link,
	Upload,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LinkedImageToolbarButton({ editor }: { editor: any }) {
	const [open, setOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [altText, setAltText] = useState("");
	const [uploading, setUploading] = useState(false);
	const [activeTab, setActiveTab] = useState("upload");
	const [sizeNotice, setSizeNotice] = useState("");

	const insert = () => {
		if (!imageUrl) return;
		editor?.commands.insertLinkedImage(imageUrl, linkUrl || null, altText);
		setImageUrl("");
		setLinkUrl("");
		setAltText("");
		setOpen(false);
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setSizeNotice("");

		// Show a warning if the file exceeds 5 MB (informational only)
		const sizeMb = file.size / (1024 * 1024);
		if (sizeMb > 5) {
			setSizeNotice(
				`Selected file is ${sizeMb.toFixed(2)} MB. Recommended max is 5 MB.`,
			);
		}

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) throw new Error("Upload failed");

			const data = await res.json();
			if (data.url) setImageUrl(data.url);
		} catch (err) {
			setSizeNotice("Upload failed. Please try again.");
			console.error(err);
		} finally {
			setUploading(false);
		}
	};

	const resetForm = () => {
		setImageUrl("");
		setLinkUrl("");
		setAltText("");
		setSizeNotice("");
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				setOpen(newOpen);
				if (!newOpen) resetForm();
			}}
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<DialogTrigger
								asChild
								className="cursor-pointer hover:text-muted-foreground"
							>
								<ImageIcon className="m-2 h-4 w-4" />
							</DialogTrigger>
						</div>
					</TooltipTrigger>
					<TooltipContent side="bottom" className="text-sm">
						Insert Image
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5" />
						Insert Image
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="upload" className="gap-2">
								<Upload className="h-4 w-4" />
								Upload
							</TabsTrigger>
							<TabsTrigger value="url" className="gap-2">
								<Link className="h-4 w-4" />
								URL
							</TabsTrigger>
						</TabsList>

						<TabsContent value="upload" className="mt-4 space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="file-upload" className="font-medium text-sm">
										Choose Image File
									</Label>

									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													aria-label="Accepted image types"
													className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
												>
													<CircleHelp className="h-4 w-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent side="bottom" className="text-xs">
												Accepted: JPG, JPEG, PNG, GIF, BMP, TIFF, TIF, WebP,
												HEIC, HEIF.
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<div className="relative">
									<Input
										id="file-upload"
										type="file"
										accept="image/*"
										onChange={handleFileUpload}
										disabled={uploading}
										className="cursor-pointer"
									/>
									{uploading && (
										<div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80">
											<div className="flex items-center gap-2 text-muted-foreground text-sm">
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
												Uploading...
											</div>
										</div>
									)}
								</div>
								{sizeNotice && (
									<div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-xs">
										{sizeNotice}
									</div>
								)}

								{imageUrl && (
									<div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-green-600 text-sm">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										Image uploaded successfully
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent value="url" className="mt-4 space-y-4">
							<div className="space-y-2">
								<Label htmlFor="image-url" className="font-medium text-sm">
									Image URL
								</Label>
								<Input
									id="image-url"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									placeholder="https://example.com/image.jpg"
									className="font-mono text-sm"
								/>
							</div>
						</TabsContent>
					</Tabs>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="link-url" className="font-medium text-sm">
								Link Destination
							</Label>
							<Input
								id="link-url"
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								placeholder="https://example.com"
								className="font-mono text-sm"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="alt-text" className="font-medium text-sm">
								Alt Text{" "}
								<span className="text-muted-foreground">(optional)</span>
							</Label>
							<Input
								id="alt-text"
								value={altText}
								onChange={(e) => setAltText(e.target.value)}
								placeholder="Describe the image for accessibility"
							/>
						</div>
					</div>

					<div className="flex gap-3 border-t pt-4">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={insert}
							disabled={!imageUrl || uploading}
							className="flex-1 gap-2"
						>
							<ExternalLink className="h-4 w-4" />
							Insert Image
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

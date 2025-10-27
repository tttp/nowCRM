"use client";

import {
	CircleHelp,
	ExternalLink,
	Link,
	Upload,
	VideoIcon,
} from "lucide-react";
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

export default function LinkedVideoToolbarButton({ editor }: { editor: any }) {
	const [open, setOpen] = useState(false);
	const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
	const [externalVideoUrl, setExternalVideoUrl] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // final uploaded thumbnail URL
	const [altText, setAltText] = useState("Play Video");
	const [uploading, setUploading] = useState(false);
	const [gifGenerating, setGifGenerating] = useState(false);
	const [activeTab, setActiveTab] = useState("upload");
	const [sizeNotice, setSizeNotice] = useState("");

	const insert = () => {
		const finalUrl =
			activeTab === "upload" ? uploadedVideoUrl : externalVideoUrl;
		if (!finalUrl) return;
		editor?.commands.insertLinkedVideo(thumbnailUrl, finalUrl, altText);
		setOpen(false);
	};

	// Single JPEG frame fallback
	const generateStill = (url: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video");
			const canvas = document.createElement("canvas");

			video.crossOrigin = "anonymous";
			video.preload = "auto";
			video.muted = true;
			video.playsInline = true;
			video.src = url;

			video.onloadeddata = () => {
				video.currentTime = 0.1;
			};

			video.onseeked = () => {
				const maxW = 640;
				const scale = Math.min(1, maxW / (video.videoWidth || maxW));
				const w = Math.max(1, Math.round((video.videoWidth || maxW) * scale));
				const h = Math.max(
					1,
					Math.round((video.videoHeight || Math.round(maxW * 0.5625)) * scale),
				);

				canvas.width = w;
				canvas.height = h;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					video.src = "";
					video.load();
					return reject("Canvas context not available");
				}
				ctx.drawImage(video, 0, 0, w, h);

				// Play icon overlay
				const tri = Math.min(w, h) / 6;
				const cx = w / 2;
				const cy = h / 2;
				ctx.fillStyle = "rgba(0,0,0,0.5)";
				ctx.beginPath();
				ctx.moveTo(cx - tri / 2, cy - tri);
				ctx.lineTo(cx + tri, cy);
				ctx.lineTo(cx - tri / 2, cy + tri);
				ctx.closePath();
				ctx.fill();

				const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
				video.src = "";
				video.load();
				resolve(dataUrl);
			};

			video.onerror = (err) => {
				video.src = "";
				video.load();
				reject(err);
			};
		});
	};

	// Animated GIF via gifenc
	const generateGifThumbnail = async (url: string): Promise<Blob> => {
		const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

		const video = document.createElement("video");
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas context not available");

		video.crossOrigin = "anonymous";
		video.preload = "auto";
		video.muted = true;
		video.playsInline = true;
		video.src = url;

		// Wait for metadata
		await new Promise<void>((resolve, reject) => {
			video.onloadedmetadata = () => resolve();
			video.onerror = () => reject(new Error("Failed to load video"));
		});

		// Sizing
		const targetW = 480;
		const scale = Math.min(1, targetW / (video.videoWidth || targetW));
		const w = Math.max(1, Math.round((video.videoWidth || targetW) * scale));
		const h = Math.max(
			1,
			Math.round((video.videoHeight || Math.round(targetW * 0.5625)) * scale),
		);
		canvas.width = w;
		canvas.height = h;

		// Capture 6 frames across first ~1.5s, avoid exact 0
		const total = 6;
		const maxWindow = Math.min(
			1.5,
			Number.isFinite(video.duration) ? video.duration : 1.5,
		);
		const times = Array.from(
			{ length: total },
			(_, i) => ((i + 1) / (total + 1)) * maxWindow,
		);

		const frames: Uint8ClampedArray[] = [];

		for (const t of times) {
			await new Promise<void>((resolve) => {
				let settled = false;

				const onSeeked = () => {
					if (settled) return;
					settled = true;
					ctx.drawImage(video, 0, 0, w, h);

					// subtle play overlay
					const tri = Math.min(w, h) / 7;
					const cx = w / 2;
					const cy = h / 2;
					ctx.fillStyle = "rgba(0,0,0,0.35)";
					ctx.beginPath();
					ctx.moveTo(cx - tri / 2, cy - tri);
					ctx.lineTo(cx + tri, cy);
					ctx.lineTo(cx - tri / 2, cy + tri);
					ctx.closePath();
					ctx.fill();

					const imgData = ctx.getImageData(0, 0, w, h);
					frames.push(imgData.data);
					video.removeEventListener("seeked", onSeeked);
					resolve();
				};

				video.addEventListener("seeked", onSeeked);
				try {
					video.currentTime = Math.min(
						t,
						Math.max(0, (video.duration || 0) - 0.05),
					);
				} catch {
					// ignore
				}

				// Fallback in case seeked never fires
				setTimeout(() => {
					if (settled) return;
					settled = true;
					try {
						ctx.drawImage(video, 0, 0, w, h);
						const imgData = ctx.getImageData(0, 0, w, h);
						frames.push(imgData.data);
					} catch {
						// ignore
					}
					video.removeEventListener("seeked", onSeeked);
					resolve();
				}, 400);
			});
		}

		if (!frames.length) {
			video.src = "";
			video.load();
			throw new Error("No frames captured for GIF");
		}

		const enc = GIFEncoder();
		const delayMs = 80;

		for (const rgba of frames) {
			const palette = quantize(rgba, 256);
			const index = applyPalette(rgba, palette);
			enc.writeFrame(index, w, h, { palette, delay: delayMs });
		}
		enc.finish();
		const bytes = enc.bytesView();

		video.src = "";
		video.load();
		//@ts-expect-error
		return new Blob([bytes], { type: "image/gif" });
	};

	// Upload video from file
	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// inline notice only
		const sizeMb = file.size / (1024 * 1024);
		if (sizeMb > 5) {
			setSizeNotice(
				`Selected file is ${sizeMb.toFixed(2)} MB. Recommended max is 5 MB.`,
			);
		} else {
			setSizeNotice("");
		}

		setUploading(true);
		try {
			// 1) upload the raw video
			const videoForm = new FormData();
			videoForm.append("file", file);
			const videoRes = await fetch("/api/upload", {
				method: "POST",
				body: videoForm,
			});
			if (!videoRes.ok) throw new Error("Video upload failed");
			const videoData = await videoRes.json();
			setUploadedVideoUrl(videoData.url);

			// 2) make an animated GIF thumbnail (fallback to still)
			setGifGenerating(true);
			try {
				const gifBlob = await generateGifThumbnail(videoData.url);
				// ✅ DEBUG: See if GIF was generated and its size
				console.log("GIF generated!", gifBlob, "Size:", gifBlob.size, "bytes");

				const gifFile = new File(
					[gifBlob],
					`thumb-${file.name.replace(/\..+$/, "")}.gif`,
					{ type: "image/gif" },
				);
				const thumbForm = new FormData();
				thumbForm.append("file", gifFile);

				const thumbRes = await fetch("/api/upload", {
					method: "POST",
					body: thumbForm,
				});
				if (!thumbRes.ok) throw new Error("GIF thumbnail upload failed");
				const thumbData = await thumbRes.json();
				setThumbnailUrl(thumbData.url);
			} catch {
				const still = await generateStill(videoData.url);
				const blob = await (await fetch(still)).blob();
				const jpgFile = new File(
					[blob],
					`thumb-${file.name.replace(/\..+$/, "")}.jpg`,
					{ type: "image/jpeg" },
				);
				const thumbForm = new FormData();
				thumbForm.append("file", jpgFile);
				const thumbRes = await fetch("/api/upload", {
					method: "POST",
					body: thumbForm,
				});
				if (!thumbRes.ok) throw new Error("Thumbnail upload failed");
				const thumbData = await thumbRes.json();
				setThumbnailUrl(thumbData.url);
			} finally {
				setGifGenerating(false);
			}
		} catch (err) {
			alert("Upload failed. Please try again.");
			console.error(err);
		} finally {
			setUploading(false);
		}
	};

	// URL path
	const handleUrlInsert = async () => {
		if (!externalVideoUrl) return;
		setThumbnailUrl(null);
		setSizeNotice("");
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					setExternalVideoUrl("");
					setUploadedVideoUrl("");
					setThumbnailUrl(null);
					setAltText("Play Video");
					setActiveTab("upload");
					setSizeNotice("");
				}
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
								<VideoIcon className="m-2 h-4 w-4" />
							</DialogTrigger>
						</div>
					</TooltipTrigger>
					<TooltipContent>Insert Video</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<VideoIcon className="h-5 w-5" />
						Insert Video
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="upload">
								<Upload className="mr-1 h-4 w-4" />
								Upload
							</TabsTrigger>
							<TabsTrigger value="url">
								<Link className="mr-1 h-4 w-4" />
								From URL
							</TabsTrigger>
						</TabsList>

						<TabsContent value="upload" className="space-y-4 pt-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Label htmlFor="file-upload" className="font-medium text-sm">
										Choose a video file
									</Label>

									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													aria-label="Accepted video types"
													className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
												>
													<CircleHelp className="h-4 w-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent side="bottom" className="text-xs">
												Accepted: MP4, MOV, AVI, MKV, WMV, FLV, WebM, M4V.
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>

							<Input
								id="file-upload"
								type="file"
								accept="video/*"
								onChange={handleFileUpload}
								disabled={uploading}
							/>

							{sizeNotice && (
								<div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-xs">
									{sizeNotice}
								</div>
							)}

							{(uploading || gifGenerating) && (
								<div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-green-600 text-sm">
									<div className="h-2 w-2 rounded-full bg-green-500" />
									{gifGenerating
										? "Generating animated thumbnail..."
										: "Processing video and generating thumbnail..."}
								</div>
							)}

							{thumbnailUrl && (
								<img
									src={thumbnailUrl}
									alt="Thumbnail preview"
									className="mt-2 max-h-64 w-auto rounded border"
								/>
							)}
						</TabsContent>

						<TabsContent value="url" className="space-y-4 pt-4">
							<Label htmlFor="video-url">Video URL</Label>
							<Input
								id="video-url"
								type="url"
								value={externalVideoUrl}
								onChange={(e) => setExternalVideoUrl(e.target.value)}
								onBlur={handleUrlInsert}
								placeholder="https://example.com/video.mp4"
							/>
						</TabsContent>
					</Tabs>

					<div className="space-y-4">
						<Label htmlFor="alt-text">Alt Text (optional)</Label>
						<Input
							id="alt-text"
							value={altText}
							onChange={(e) => setAltText(e.target.value)}
							placeholder="Describe the video"
						/>
					</div>

					<div className="flex justify-end gap-2 border-t pt-4">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={insert}
							disabled={
								uploading ||
								(activeTab === "upload" &&
									(!uploadedVideoUrl || !thumbnailUrl)) ||
								(activeTab === "url" && !externalVideoUrl)
							}
						>
							<ExternalLink className="h-4 w-4" />
							Insert Video
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

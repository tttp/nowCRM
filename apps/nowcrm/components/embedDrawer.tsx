// contactsapp/components/embedDrawer.tsx

"use client";

import { Code, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmbedDrawerProps {
	pageUrl: string;
}

export default function EmbedDrawer({ pageUrl }: EmbedDrawerProps) {
	const [copied, setCopied] = useState(false);

	// Append isEmbedded=1 to the page URL for embedding
	const embeddedPageUrl = appendIsEmbeddedParam(pageUrl);

	// Generate iframe code with the embedded page URL
	const iframeCode = `<div style="width: 100%; max-width: 1000px; height: 600px; margin: 0 auto;">
  <iframe 
    src="${embeddedPageUrl}" 
    style="width: 100%; height: 100%; border: none;" 
    allowfullscreen
  ></iframe>
</div>`;

	// Generate direct link code with embed param
	const directLinkCode = embeddedPageUrl;

	const copyToClipboard = (text: string) => {
		console.log(copied);
		navigator.clipboard.writeText(text);
		setCopied(true);
		toast.success("Copied to clipboard!");

		// Reset copied state after 2 seconds
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" size="sm">
					<Code className="h-4 w-4" />
					<span className="hidden md:inline">Embed</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-md">
					<DrawerHeader>
						<DrawerTitle>Embed this form</DrawerTitle>
						<DrawerDescription>
							Copy the code to embed this form on your website.
						</DrawerDescription>
					</DrawerHeader>

					<div className="p-4">
						<Tabs defaultValue="iframe" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="iframe">iFrame Embed</TabsTrigger>
								<TabsTrigger value="link">Direct Link</TabsTrigger>
							</TabsList>

							<TabsContent value="iframe" className="mt-4">
								<div className="space-y-4">
									<div className="relative">
										<Input
											value={iframeCode}
											readOnly
											className="h-24 pr-10 font-mono text-xs"
										/>
										<Button
											size="sm"
											variant="ghost"
											className="absolute top-1 right-1"
											onClick={() => copyToClipboard(iframeCode)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>

									<div className="text-muted-foreground text-sm">
										<h4 className="mb-1 font-medium">Preview:</h4>
										<div className="rounded-md border bg-muted/30 p-4">
											<div className="text-center text-muted-foreground text-xs">
												<iframe
													src={embeddedPageUrl}
													width="100%"
													height="auto"
													style={{
														border: "1px solid #ccc",
														maxWidth: "100%",
														margin: "0 auto",
														borderRadius: "8px",
													}}
													title="iFrame Preview"
												/>
											</div>
										</div>
									</div>

									<div className="space-y-2 text-sm">
										<h4 className="font-medium">Customization Options:</h4>
										<ul className="list-disc pl-5 text-muted-foreground">
											<li>Adjust the width and height in the iframe code</li>
											<li>Modify the border style if needed</li>
											<li>Set max-width to control the form size</li>
										</ul>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="link" className="mt-4">
								<div className="space-y-4">
									<div className="relative">
										<Input value={directLinkCode} readOnly className="pr-10" />
										<Button
											size="sm"
											variant="ghost"
											className="absolute top-1 right-1"
											onClick={() => copyToClipboard(directLinkCode)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>

									<div className="text-muted-foreground text-sm">
										Share this direct link to your form
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>

					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

// Helper function to append isEmbedded=1 to URLs (supports relative URLs too)
function appendIsEmbeddedParam(url: string): string {
	try {
		const parsed = new URL(
			url,
			typeof window !== "undefined"
				? window.location.origin
				: "http://localhost",
		);
		parsed.searchParams.set("isEmbedded", "1");
		return parsed.toString();
	} catch (_e) {
		const hasQuery = url.includes("?");
		return `${url}${hasQuery ? "&" : "?"}isEmbedded=1`;
	}
}

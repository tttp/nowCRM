"use client";

import { Check, Copy, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const GETParamHelpModal = ({
	shareUrl,
	fields,
}: {
	shareUrl: string;
	fields: { label: string; name: string; type: string }[];
}) => {
	const [copied, setCopied] = useState(false);

	const sampleParams = fields
		.slice(0, 5)
		.map(({ name }) => `${name}=example`)
		.join("&");

	const exampleUrl = `${shareUrl}?${sampleParams}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(exampleUrl).then(() => {
			setCopied(true);
			toast.success("URL copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline" className="ml-2">
					<Info className="mr-1 h-4 w-4" />
					<span className="hidden md:inline">GET Params Help</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogTitle className="font-semibold text-lg">
					Prefill Form via GET Params
				</DialogTitle>
				<p className="text-muted-foreground text-sm">
					You can prefill this form using URL parameters by matching the field{" "}
					<strong>name</strong> values.
				</p>

				<div className="relative mt-4 rounded-md border bg-muted/30 p-3 text-sm">
					<p className="mb-2 font-medium">Sample URL:</p>
					<code className="block break-all pr-10 font-mono text-xs">
						{exampleUrl}
					</code>
					<Button
						onClick={handleCopy}
						className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground hover:text-foreground"
						aria-label="Copy to clipboard"
					>
						{copied ? (
							<Check className="h-4 w-4 text-green-600" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>
				</div>

				<div className="mt-4 max-h-40 overflow-y-auto text-sm">
					<p className="mb-2 font-medium">Current field names:</p>
					<ul className="ml-4 list-disc space-y-1">
						{fields.map(({ label, name, type }) => (
							<li key={name}>
								<code className="font-mono">{name}</code> — {label} ({type})
							</li>
						))}
					</ul>
				</div>

				<p className="mt-4 text-muted-foreground text-xs">
					Example: <code>?first_name=Hans&email=test@example.com</code>
				</p>
			</DialogContent>
		</Dialog>
	);
};

export default GETParamHelpModal;

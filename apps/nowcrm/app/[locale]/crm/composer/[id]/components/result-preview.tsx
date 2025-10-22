"use client";

import { useMessages } from "next-intl";
import { Textarea } from "@/components/ui/textarea";

interface ResultPreviewProps {
	result: string;
}

export function ResultPreview({ result }: ResultPreviewProps) {
	const t = useMessages().Composer.channelContent;
	console.log(t);
	return (
		<div className="space-y-4">
			<Textarea
				id="result-preview"
				key="result-preview"
				value={result}
				className="w-full"
			/>
		</div>
	);
}

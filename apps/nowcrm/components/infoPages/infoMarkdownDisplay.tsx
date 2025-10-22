"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StandardResponse } from "@/lib/services/common/response.service";

interface InfoContent {
	title?: string;
	text?: string;
}

interface InfoMarkdownDisplayComponentProps {
	title: string;
	fetchContent: () => Promise<StandardResponse<InfoContent[]>>;
	errorMessage?: string;
}

export function InfoMarkdownDisplay({
	title,
	fetchContent,
	errorMessage = "Failed to load content. Please try again later.",
}: InfoMarkdownDisplayComponentProps) {
	const [content, setContent] = useState<InfoContent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const result = await fetchContent();

				if (result.success && result.data) {
					setContent(result.data);
				} else {
					setError(result.errorMessage || errorMessage);
				}
			} catch (err) {
				console.error(`Error fetching ${title}:`, err);
				setError(errorMessage);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [fetchContent, errorMessage, title]);

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<CardTitle className="font-bold text-2xl">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading && (
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-[90%]" />
						<Skeleton className="h-4 w-[95%]" />
						<Skeleton className="h-4 w-[85%]" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-4 w-[90%]" />
						<Skeleton className="h-4 w-full" />
					</div>
				)}

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{!isLoading && !error && content.length > 0 && (
					<div className="prose dark:prose-invert max-w-none">
						{content.map((item, index) => (
							<div key={index} className="mb-8">
								{item.title && (
									<h2 className="mb-2 font-semibold text-xl">{item.title}</h2>
								)}
								{item.text && (
									<div
										className="mt-4"
										// Using dangerouslySetInnerHTML to output HTML content.
										dangerouslySetInnerHTML={{ __html: item.text }}
									/>
								)}
							</div>
						))}
					</div>
				)}

				{!isLoading && !error && content.length === 0 && (
					<p>No content available.</p>
				)}
			</CardContent>
		</Card>
	);
}

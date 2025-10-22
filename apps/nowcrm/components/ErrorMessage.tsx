"use client";

import { AlertCircle } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { StandardResponse } from "@/lib/services/common/response.service";

interface ErrorMessageProps {
	response: StandardResponse<any>;
}

export default function ErrorMessage({ response }: ErrorMessageProps) {
	if (response.success) {
		return null;
	}

	const statusMessages: { [key: number]: string } = {
		400: "Bad Request. Please check your input and try again.",
		401: "Unauthorized. Please log in to continue.",
		403: "Forbidden. You don't have permission to access this resource.",
		404: "Not Found. The requested resource could not be found.",
		500: "Server Error. Our team is working to resolve the issue.",
		502: "Bad Gateway. Please try again later.",
		503: "Service Unavailable. Please try again later.",
		504: "Gateway Timeout. Please try again later.",
	};

	const message =
		statusMessages[response.status] ||
		response.errorMessage ||
		"An unexpected error occurred.";

	return (
		<div className="mt-5 flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle className="text-destructive">Error</CardTitle>
					</div>
					<CardDescription>Status Code: {response.status}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">{message}</p>
				</CardContent>
			</Card>
		</div>
	);
}

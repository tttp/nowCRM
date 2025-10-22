"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { unsubscribeUser } from "@/lib/actions/unsubscribeUser";

export default function UnsubscribeComponent({
	email,
	channel,
	compositionId,
}: {
	email: string;
	channel?: string;
	compositionId?: number;
}) {
	const [status, setStatus] = useState<{
		success: boolean;
		message: string;
		completed: boolean;
	}>({
		success: false,
		message: "",
		completed: false,
	});

	const effectiveChannel = channel || "Email";

	const handleUnsubscribe = async () => {
		console.log("Unsubscribe clicked with email and channel:", {
			email,
			channel: effectiveChannel,
			compositionId,
		});

		try {
			const result = await unsubscribeUser(
				email,
				effectiveChannel,
				compositionId,
			);
			setStatus({
				success: result.success,
				message: result.message,
				completed: true,
			});
		} catch (error) {
			console.error("Error calling unsubscribeUser:", error);
			setStatus({
				success: false,
				message:
					"An error occurred while processing your request. Please try again.",
				completed: true,
			});
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="w-full max-w-md">
				{/* Logo Section */}
				<div className="mb-8 flex justify-center">
					<Image
						src="/nowcrm-black-red.svg"
						alt="Company Logo"
						width={180}
						height={60}
						priority
					/>
				</div>

				<Card className="w-full">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Email Preferences</CardTitle>
						<CardDescription>
							{effectiveChannel === "All"
								? "You're about to unsubscribe from all communication channels."
								: `You're about to unsubscribe from ${effectiveChannel} messages.`}
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						{!status.completed ? (
							<>
								<p className="mb-6 text-muted-foreground">
									We're sorry to see you go. You can resubscribe at any time by
									updating your preferences.
								</p>
								<Button onClick={handleUnsubscribe} className="w-full">
									Unsubscribe
								</Button>
							</>
						) : status.success ? (
							<div className="space-y-4">
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
									<CheckCircle className="h-6 w-6 text-green-500" />
								</div>
								<p className="text-muted-foreground text-sm">
									{status.message ||
										`You have been unsubscribed from ${effectiveChannel} successfully.`}
								</p>
							</div>
						) : (
							<div className="space-y-4">
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
									<AlertCircle className="h-6 w-6 text-red-500" />
								</div>
								<p className="font-medium">Unsubscribe Failed</p>
								<p className="text-muted-foreground text-sm">
									{status.message}
								</p>
								<Button
									onClick={handleUnsubscribe}
									variant="outline"
									size="sm"
									className="mt-2"
								>
									Try Again
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

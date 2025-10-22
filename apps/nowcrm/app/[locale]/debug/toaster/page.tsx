"use client";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamplePage() {
	const showSuccess = () =>
		toast.success("✅ Everything worked perfectly!", { duration: 1000 });
	const showError = () =>
		toast.error("❌ Something went wrong!", { duration: 1000 });
	const showLoading = () =>
		toast.loading("Loading, please wait...", { duration: 2000 });
	const showLongText = () =>
		toast(
			"This is a super long toast message that should wrap nicely into multiple lines and not break the layout even if it's really, really, really long.",
			{ duration: 1000 },
		);

	const showPromise = () => {
		toast.promise(
			new Promise((resolve) => setTimeout(resolve, 2000)),
			{
				loading: "Processing your request...",
				success: "Done! 🎉",
				error: "Uh oh! Something went wrong.",
			},
			{ duration: 2000 },
		);
	};

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Toaster Examples</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center gap-2">
					<Button onClick={showSuccess}>Show Success Toast</Button>
					<Button onClick={showError} variant="destructive">
						Show Error Toast
					</Button>
					<Button onClick={showLoading} variant="outline">
						Show Loading Toast
					</Button>
					<Button onClick={showPromise} variant="secondary">
						Show Promise Toast
					</Button>
					<Button onClick={showLongText}>Show Long Message Toast</Button>
				</CardContent>
			</Card>
		</div>
	);
}

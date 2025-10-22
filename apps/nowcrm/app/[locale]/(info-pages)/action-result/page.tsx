"use server";

import ActionResult from "@/components/actionResult";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	// Extract parameters from URL
	const params = await searchParams;
	const type = (params.type?.toString() || "info") as
		| "success"
		| "error"
		| "info";
	const title = params.title?.toString();
	const description = params.description?.toString();
	const returnUrl = params.returnUrl?.toString() || "/";
	const returnText = params.returnText?.toString() || "Return Home";

	// Set page title based on result type
	let pageTitle = "";
	let pageSubtitle = "";

	switch (type) {
		case "success":
			pageTitle = "Success";
			pageSubtitle = "Your action was completed successfully.";
			break;
		case "error":
			pageTitle = "Error";
			pageSubtitle = "There was a problem with your request.";
			break;
		default:
			pageTitle = "Information";
			pageSubtitle = "Here's some important information.";
	}

	return (
		<div className="container relative hidden min-h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
					<Card className="border-0 shadow-lg">
						<CardHeader className="space-y-1">
							<CardTitle className="font-bold text-2xl tracking-tight">
								{title || pageTitle}
							</CardTitle>
							<CardDescription>{pageSubtitle}</CardDescription>
						</CardHeader>
						<CardContent>
							<ActionResult
								type={type}
								title={title}
								description={description}
								returnUrl={returnUrl}
								returnText={returnText}
								className="border-0 shadow-none"
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, HelpCircle, ListPlus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GrAddCircle } from "react-icons/gr";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddNewIdentityUnipile } from "@/lib/actions/healthCheck/refresh-unipile";

const formSchema = z.object({
	identity: z.string().min(1, "Name for identity required"),
});

export default function CreateIdentityDialog() {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [isGeneratingToken, setGeneratingToken] = React.useState(false);
	const [authUrl, setAuthUrl] = React.useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			identity: "",
		},
	});

	const generateUrl = async (name: string) => {
		setGeneratingToken(true);
		try {
			const url = await AddNewIdentityUnipile(name);
			if (url.data && url.data.length > 0) {
				setAuthUrl(url.data);
				toast.success("Please click the link to authorize new Unipile account");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to get authorization URL");
		} finally {
			setGeneratingToken(false);
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await generateUrl(values.identity);
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="ml-2 hidden h-8 lg:flex">
					<GrAddCircle className="mr-2 h-4 w-4" />
					Create
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create new unipile identity</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="identity"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center">
										<FormLabel>Name for your identity</FormLabel>
									</div>
									<FormControl>
										<Input placeholder="Enter identity email..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{authUrl && (
							<div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
								<div className="flex flex-col gap-2">
									<h5 className="flex items-center gap-2 font-medium text-blue-800 text-sm">
										Authorization Required
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="cursor-help">
														<HelpCircle className="h-4 w-4 text-muted-foreground" />
													</div>
												</TooltipTrigger>
												<TooltipContent className="w-80 p-2">
													<p className="mb-1 font-medium">
														Account should be associated with Linkedin APP
														credentials
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</h5>
									<p className="text-blue-700 text-sm">
										Click the link below to authorize access to your LinkedIn
										account:
									</p>
									<a
										href={authUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 font-medium text-blue-600 text-sm hover:text-blue-800"
									>
										Authorize LinkedIn Access{" "}
										<ExternalLink className="h-3 w-3" />
									</a>
								</div>
							</div>
						)}
						<Button
							type="submit"
							disabled={isGeneratingToken}
							className="w-full"
						>
							<ListPlus className="mr-2 h-4 w-4" />
							Get Url
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

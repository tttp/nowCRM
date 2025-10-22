"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	DollarSign,
	Info,
	Layers,
	Linkedin,
	RefreshCw,
	Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { updateSettingCredentials } from "@/lib/actions/settings/credentials/updateSettingsCredentials";
import {
	getStatusColor,
	getStatusIcon,
} from "@/lib/static/healthCheckStatuses";
import type { SettingCredential } from "@/lib/types/new_type/settings";

interface UnipileHealthCheckProps {
	unipile_credential: Omit<SettingCredential, "setting">;
}

const formSchema = z.object({
	client_id: z.string().min(1, "Dsn is required"),
	client_secret: z.string().min(1, "API token is required"),
});

export function UnipileHealthCheck({
	unipile_credential,
}: UnipileHealthCheckProps) {
	const t = useMessages().Admin.Channels;

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: unipile_credential
			? {
					client_id: unipile_credential.client_id || "",
					client_secret: unipile_credential.client_secret || "",
				}
			: {
					client_id: "",
					client_secret: "",
				},
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const res = await updateSettingCredentials(unipile_credential.id, {
				...values,
				status: "active",
			});
			if (res.success) {
				toast.success("LinkedIn credentials updated successfully");
				router.refresh();
			} else {
				toast.error("Error during updating credentials for linkedin");
			}
			setIsOpen(false);
		} catch (error) {
			toast.error("Failed to update LinkedIn credentials");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Card className="cursor-pointer transition-colors hover:bg-muted">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="rounded-full p-2">
									<Linkedin className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium">
										Unipile(Linkedin Invitations related)
									</h3>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full px-2 py-1 text-xs ${getStatusColor(unipile_credential.status)}`}
								>
									{unipile_credential.status}
								</span>
								{getStatusIcon(unipile_credential.status)}
								<div>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="w-full cursor-help">
													<Info className="h-5 w-5 text-muted-foreground" />
												</div>
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="start"
												className="z-50 max-w-sm rounded-lg border-2 border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
											>
												<div className="space-y-2 text-black dark:text-white">
													<div className="flex items-center gap-2">
														<Layers className="h-5 w-5 text-indigo-500" />
														<h4 className="font-medium">
															{t.unipile_linkedin.tooltip.title}
														</h4>
													</div>
													<p className="text-sm">
														{t.unipile_linkedin.tooltip.description}{" "}
													</p>
													<div className="mt-2 border-gray-200 border-t pt-2 dark:border-gray-700">
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<DollarSign className="h-3.5 w-3.5" />
															<span>{t.unipile_linkedin.tooltip.price}</span>
														</div>
														<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
															<AlertCircle className="h-3.5 w-3.5" />
															<span>{t.unipile_linkedin.tooltip.info}</span>
														</div>
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className="min-w-max">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Linkedin className="h-5 w-5" />
						Unipile Configuration
					</DialogTitle>
					<DialogDescription>
						Manage your LinkedIn invites status
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="font-medium text-sm">Connection Status</h4>
						<span
							className={`rounded-full px-2 py-1 text-xs ${getStatusColor(unipile_credential.status)}`}
						>
							{unipile_credential.status}
						</span>
					</div>

					{unipile_credential?.status === "invalid" ||
					(unipile_credential?.status === "disconnected" &&
						unipile_credential?.error_message) ? (
						<div
							className={`mb-4 rounded-md border p-3 ${
								unipile_credential?.status === "invalid"
									? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
									: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
							}`}
						>
							<div className="flex items-start">
								<AlertCircle
									className={`mt-0.5 mr-2 h-5 w-5 shrink-0 ${
										unipile_credential?.status === "invalid"
											? "text-red-500 dark:text-red-400"
											: "text-amber-500 dark:text-amber-400"
									}`}
								/>
								<div>
									<h5
										className={`font-medium text-sm ${
											unipile_credential?.status === "invalid"
												? "text-red-800 dark:text-red-400"
												: "text-amber-800 dark:text-amber-400"
										}`}
									>
										{unipile_credential?.status === "invalid"
											? "Invalid Credentials"
											: "Error Details"}
									</h5>
									<p
										className={`text-sm ${
											unipile_credential?.status === "invalid"
												? "text-red-700 dark:text-red-300"
												: "text-amber-700 dark:text-amber-300"
										}`}
									>
										{unipile_credential?.error_message}
									</p>
								</div>
							</div>
						</div>
					) : null}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="client_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Unipile DSN</FormLabel>
										<FormControl>
											<Input placeholder="Enter unipile DSN" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="client_secret"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Unipile API token</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter unipile api token"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter className="flex flex-col items-center justify-between gap-2 pt-4 sm:flex-row">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="flex w-full items-center gap-2 sm:w-auto"
								>
									{isSubmitting ? (
										<>
											<RefreshCw className="h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="h-4 w-4" />
											Save Credentials
										</>
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

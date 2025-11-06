"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	DollarSign,
	Globe,
	HelpCircle,
	Info,
	RefreshCw,
	Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWordpress } from "react-icons/fa";
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
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateSettingCredentials } from "@/lib/actions/settings/credentials/update-setting-credential";
import {
	getStatusColor,
	getStatusIcon,
} from "@/lib/static/healthCheckStatuses";
import type { SettingCredential } from "@/lib/types/new_type/settings";

interface WordPressHealthCheckProps {
	wordpress_credential: Omit<SettingCredential, "setting">;
}

export function WordpressHealthCheck({
	wordpress_credential,
}: WordPressHealthCheckProps) {
	const t = useMessages().Admin.Channels;

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const formSchema = z.object({
		wp_url: z.string().min(1, t.wordPress.form.wpUrl.errorMessage),
		//here we save password and username
		client_id: z.string().min(1, t.wordPress.form.wpUrl.errorMessage),
		client_secret: z.string().min(1, t.wordPress.form.clientId.errorMessage),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: wordpress_credential
			? {
					wp_url: wordpress_credential.wp_url,
					client_id: wordpress_credential.client_id,
					client_secret: wordpress_credential.client_secret,
				}
			: {
					wp_url: "",
					client_id: "",
					client_secret: "",
				},
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		setIsSubmitting(true);
		try {
			const res = await updateSettingCredentials(wordpress_credential.id, {
				...values,
				status: "disconnected",
				error_message: "Try to run health check so we can verify status",
			});
			if (res.success) {
				toast.success(t.wordPress.toast.success.credentialsUpdated);
				router.refresh();
			} else {
				toast.error(t.wordPress.toast.error.updateCredentialsError);
			}
			setIsOpen(false);
		} catch (error) {
			toast.error(t.wordPress.toast.error.failedCredentialsError);
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
									<FaWordpress className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium">WordPress</h3>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full px-2 py-1 text-xs ${getStatusColor(wordpress_credential.status)}`}
								>
									{wordpress_credential.status}
								</span>
								{getStatusIcon(wordpress_credential.status)}
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
														<Globe className="h-5 w-5 text-blue-600" />
														<h4 className="font-medium">
															{t.wordPress.tooltip.title}
														</h4>
													</div>
													<p className="text-sm">
														{t.wordPress.tooltip.description}
													</p>
													<div className="mt-2 border-gray-200 border-t pt-2 dark:border-gray-700">
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<DollarSign className="h-3.5 w-3.5" />
															<span>{t.wordPress.tooltip.price}</span>
														</div>
														<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
															<AlertCircle className="h-3.5 w-3.5" />
															<span>{t.wordPress.tooltip.info}</span>
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
						<FaWordpress className="h-5 w-5" />
						{t.wordPress.title}
					</DialogTitle>
					<DialogDescription>{t.wordPress.description}</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="font-medium text-sm">{t.common.status}</h4>
						<span
							className={`rounded-full px-2 py-1 text-xs ${getStatusColor(wordpress_credential.status)}`}
						>
							{wordpress_credential.status}
						</span>
					</div>

					{wordpress_credential?.status === "invalid" ||
					(wordpress_credential?.status === "disconnected" &&
						wordpress_credential?.error_message) ? (
						<div
							className={`mb-4 rounded-md border p-3 ${
								wordpress_credential?.status === "invalid"
									? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
									: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
							}`}
						>
							<div className="flex items-start">
								<AlertCircle
									className={`mt-0.5 mr-2 h-5 w-5 shrink-0 ${
										wordpress_credential?.status === "invalid"
											? "text-red-500 dark:text-red-400"
											: "text-amber-500 dark:text-amber-400"
									}`}
								/>
								<div>
									<h5
										className={`font-medium text-sm ${
											wordpress_credential?.status === "invalid"
												? "text-red-800 dark:text-red-400"
												: "text-amber-800 dark:text-amber-400"
										}`}
									>
										{wordpress_credential?.status === "invalid"
											? t.common.invalidCredentials
											: t.common.errorDetails}
									</h5>
									<p
										className={`text-sm ${
											wordpress_credential?.status === "invalid"
												? "text-red-700 dark:text-red-300"
												: "text-amber-700 dark:text-amber-300"
										}`}
									>
										{wordpress_credential?.error_message}
									</p>
								</div>
							</div>
						</div>
					) : null}

					<Separator className="my-4" />

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="wp_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>WordPress URL</FormLabel>
										<FormControl>
											<Input
												placeholder={t.wordPress.form.wpUrl.placeholder}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="client_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											Account Name
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="cursor-help">
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</div>
													</TooltipTrigger>
													<TooltipContent className="w-80 p-2">
														<p className="mb-1 font-medium">
															{t.wordPress.form.clientId.tooltip}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t.wordPress.form.clientId.placeholderName}
												{...field}
											/>
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
										<FormLabel className="flex items-center gap-2">
											Account password
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={
													t.wordPress.form.clientId.placeholderPassword
												}
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
									className="flex w-full cursor-pointer items-center gap-2 sm:w-auto"
								>
									{isSubmitting ? (
										<>
											<RefreshCw className="h-4 w-4 animate-spin" />
											{t.common.saveButton.savingText}
										</>
									) : (
										<>
											<Save className="h-4 w-4" />
											{t.common.saveButton.defaultText}
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

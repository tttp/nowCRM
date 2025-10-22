"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	DollarSign,
	Info,
	MessageCircle,
	MessageSquare,
	RefreshCw,
	Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

interface LinkedInHealthCheckProps {
	sns_credential: Omit<SettingCredential, "setting">;
}

import { useMessages } from "next-intl";
import regions from "@/lib/static/aws_regions.json";

export function SmsHealthCheck({ sns_credential }: LinkedInHealthCheckProps) {
	const t = useMessages().Admin.Channels;

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const formSchema = z.object({
		client_id: z.string().min(1, t.sms.form.accessKey.errorMessage),
		client_secret: z.string().min(1, t.sms.form.accessToken.errorMessage),
		organization_urn: z.string().min(1, t.sms.form.snsRegion.errorMessage), // inside org urn we save region for SNS case
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: sns_credential
			? {
					client_id: sns_credential.client_id,
					client_secret: sns_credential.client_secret,
					organization_urn: sns_credential.organization_urn || "eu-central-1",
				}
			: {
					client_id: "",
					client_secret: "",
					organization_urn: "eu-central-1",
				},
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		setIsSubmitting(true);
		try {
			const res = await updateSettingCredentials(sns_credential.id, {
				...values,
				status: "disconnected",
				error_message: "Please run health check to verify channel status",
			});
			if (res.success) {
				toast.success(t.sms.toast.success.credentialsUpdated);
				router.refresh();
			} else {
				toast.error(t.sms.toast.error.updateCredentialsError);
			}
			setIsOpen(false);
		} catch (error) {
			toast.error(t.sms.toast.error.failedCredentialsError);
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
									<MessageSquare className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium">SMS</h3>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full px-2 py-1 text-xs ${getStatusColor(sns_credential.status)}`}
								>
									{sns_credential.status}
								</span>
								{getStatusIcon(sns_credential.status)}
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
														<MessageCircle className="h-5 w-5 text-purple-500" />
														<h4 className="font-medium">
															{t.sms.tooltip.title}
														</h4>
													</div>
													<p className="text-sm">{t.sms.tooltip.description}</p>
													<div className="mt-2 border-gray-200 border-t pt-2 dark:border-gray-700">
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<DollarSign className="h-3.5 w-3.5" />
															<span>{t.sms.tooltip.price}</span>
														</div>
														<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
															<AlertCircle className="h-3.5 w-3.5" />
															<span>{t.sms.tooltip.info}</span>
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
						<MessageSquare className="h-5 w-5" />
						{t.sms.title}
					</DialogTitle>
					<DialogDescription>{t.sms.description}</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="font-medium text-sm">{t.common.status}</h4>
						<span
							className={`rounded-full px-2 py-1 text-xs ${getStatusColor(sns_credential.status)}`}
						>
							{sns_credential.status}
						</span>
					</div>

					{sns_credential?.status === "invalid" ||
					(sns_credential?.status === "disconnected" &&
						sns_credential?.error_message) ? (
						<div
							className={`mb-4 rounded-md border p-3 ${
								sns_credential?.status === "invalid"
									? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
									: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
							}`}
						>
							<div className="flex items-start">
								<AlertCircle
									className={`mt-0.5 mr-2 h-5 w-5 shrink-0 ${
										sns_credential?.status === "invalid"
											? "text-red-500 dark:text-red-400"
											: "text-amber-500 dark:text-amber-400"
									}`}
								/>
								<div>
									<h5
										className={`font-medium text-sm ${
											sns_credential?.status === "invalid"
												? "text-red-800 dark:text-red-400"
												: "text-amber-800 dark:text-amber-400"
										}`}
									>
										{sns_credential?.status === "invalid"
											? t.common.invalidCredentials
											: t.common.errorDetails}
									</h5>
									<p
										className={`text-sm ${
											sns_credential?.status === "invalid"
												? "text-red-700 dark:text-red-300"
												: "text-amber-700 dark:text-amber-300"
										}`}
									>
										{sns_credential?.error_message}
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
								name="client_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											Access Key ID
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t.sms.form.accessKey.placeholder}
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
										<FormLabel>Secret Access Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={t.sms.form.accessToken.placeholder}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="organization_urn"
								render={({ field }) => (
									<FormItem>
										<FormLabel>SNS region</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger id="organization_urn">
													<SelectValue
														placeholder={t.sms.form.snsRegion.placeholder}
													/>
												</SelectTrigger>
												<SelectContent>
													{regions.map((region) => (
														<SelectItem
															key={`${region.label}`}
															value={region.value}
														>
															{region.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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

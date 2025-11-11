"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	ExternalLink,
	HelpCircle,
	Info,
	Linkedin,
	LinkedinIcon,
	RefreshCw,
	Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { refreshAccessLinkedin } from "@/lib/actions/healthCheck/refresh-access-linkedin";
import { updateSettingCredentials } from "@/lib/actions/settings/credentials/update-setting-credential";
import {
	getStatusColor,
	getStatusIcon,
} from "@/lib/static/healthCheckStatuses";
import { SettingCredential } from "@nowcrm/services";

interface LinkedInHealthCheckProps {
	linkedin_credential: Omit<SettingCredential, "setting">;
}

export function LinkedInHealthCheck({
	linkedin_credential,
}: LinkedInHealthCheckProps) {
	const t = useTranslations("Admin.Channels");

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefreshingToken, setIsRefreshingToken] = useState(false);
	const [authUrl, setAuthUrl] = useState<string | null>(null);
	const router = useRouter();

	const formSchema = z.object({
		client_id: z.string().min(1, t("linkedin.form.clientId.errorMessage")),
		client_secret: z
			.string()
			.min(1, t("linkedin.form.clientSecret.errorMessage")),
		organization_urn: z
			.string()
			.min(1, t("linkedin.form.organizationUrn.errorMessage")),
	});

	const refreshAccessToken = async () => {
		setIsRefreshingToken(true);
		try {
			const url = await refreshAccessLinkedin();
			if (url.data && url.data.length > 0) {
				setAuthUrl(url.data);
				toast.success(t("linkedin.toast.success.connectionSuccess"));
			} else {
				toast.success(t("linkedin.toast.success.tokenRefreshed"));
			}
		} catch (error) {
			console.error(error);
			toast.error(t("linkedin.toast.error.refreshTokenError"));
		} finally {
			setIsRefreshingToken(false);
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: linkedin_credential
			? {
					client_id: linkedin_credential.client_id,
					client_secret: linkedin_credential.client_secret,
					organization_urn: linkedin_credential.organization_urn,
				}
			: {
					client_id: "",
					client_secret: "",
					organization_urn: "",
				},
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const res = await updateSettingCredentials(linkedin_credential.documentId, {
				...values,
				credential_status: "disconnected",
				error_message: "Please refresh your access token first",
				access_token: "",
				refresh_token: "",
			});
			if (res.success) {
				toast.success(t("linkedin.toast.success.credentialsUpdated"));
				router.refresh();
			} else {
				toast.error(t("linkedin.toast.error.updateCredentialsError"));
			}
			setIsOpen(false);
		} catch (error) {
			toast.error(t("linkedin.toast.error.failedCredentialsError"));
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
									<h3 className="font-medium">LinkedIn</h3>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full px-2 py-1 text-xs ${getStatusColor(linkedin_credential.credential_status)}`}
								>
									{linkedin_credential.credential_status}
								</span>
								{getStatusIcon(linkedin_credential.credential_status)}
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
														<LinkedinIcon className="h-5 w-5 text-blue-600" />
														<h4 className="font-medium">
															{t("linkedin.tooltip.title")}
														</h4>
													</div>
													<p className="text-sm">
														{t("linkedin.tooltip.description")}
													</p>
													<div className="mt-2 border-gray-200 border-t pt-2 dark:border-gray-700">
														<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
															<AlertCircle className="h-3.5 w-3.5" />
															<span>{t("linkedin.tooltip.info")}</span>
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
						{t("linkedin.title")}
					</DialogTitle>
					<DialogDescription>{t("linkedin.description")}</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="font-medium text-sm">
							{t("common.connectionStatusTitle")}
						</h4>
						<span
							className={`rounded-full px-2 py-1 text-xs ${getStatusColor(linkedin_credential.credential_status)}`}
						>
							{linkedin_credential.credential_status}
						</span>
					</div>

					{linkedin_credential?.credential_status === "invalid" ||
					(linkedin_credential?.credential_status === "disconnected" &&
						linkedin_credential?.error_message) ? (
						<div
							className={`mb-4 rounded-md border p-3 ${
								linkedin_credential?.credential_status === "invalid"
									? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
									: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
							}`}
						>
							<div className="flex items-start">
								<AlertCircle
									className={`mt-0.5 mr-2 h-5 w-5 shrink-0 ${
										linkedin_credential?.credential_status === "invalid"
											? "text-red-500 dark:text-red-400"
											: "text-amber-500 dark:text-amber-400"
									}`}
								/>
								<div>
									<h5
										className={`font-medium text-sm ${
											linkedin_credential?.credential_status === "invalid"
												? "text-red-800 dark:text-red-400"
												: "text-amber-800 dark:text-amber-400"
										}`}
									>
										{linkedin_credential?.credential_status === "invalid"
											? t("common.invalidCredentials")
											: t("common.errorDetails")}
									</h5>
									<p
										className={`text-sm ${
											linkedin_credential?.credential_status === "invalid"
												? "text-red-700 dark:text-red-300"
												: "text-amber-700 dark:text-amber-300"
										}`}
									>
										{linkedin_credential?.error_message}
									</p>
								</div>
							</div>
						</div>
					) : null}

					{/* Auth URL section */}
					{authUrl && (
						<div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
							<div className="flex flex-col gap-2">
								<h5 className="flex items-center gap-2 font-medium text-blue-800 text-sm">
									{t("common.authorizationRequired")}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<HelpCircle className="h-4 w-4 text-muted-foreground" />
												</div>
											</TooltipTrigger>
											<TooltipContent className="w-80 p-2">
												<p className="mb-1 font-medium">
													{t("linkedin.authorizationTooltip")}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</h5>
								<p className="text-blue-700 text-sm">
									{t("linkedin.linkAccess")}
								</p>
								<a
									href={authUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 font-medium text-blue-600 text-sm hover:text-blue-800"
								>
									{t("linkedin.authorizeLinkedinAccess")}{" "}
									<ExternalLink className="h-3 w-3" />
								</a>
							</div>
						</div>
					)}

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
										<FormLabel>LinkedIn Client ID</FormLabel>
										<FormControl>
											<Input
												placeholder={t("linkedin.form.clientId.placeholder")}
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
										<FormLabel className="flex items-center gap-2">
											Organization URN
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="cursor-help">
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</div>
													</TooltipTrigger>
													<TooltipContent className="w-80 p-2">
														<p className="mb-1 font-medium">
															{t("linkedin.form.organizationUrn.tooltip")}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"linkedin.form.organizationUrn.placeholder",
												)}
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
										<FormLabel>LinkedIn Client Secret</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={t(
													"linkedin.form.clientSecret.placeholder",
												)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter className="flex flex-col items-center justify-between gap-2 pt-4 sm:flex-row">
								<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
									<Button
										type="button"
										onClick={refreshAccessToken}
										disabled={isRefreshingToken || isSubmitting}
										variant="outline"
										className="flex w-full cursor-pointer items-center gap-2 sm:w-auto"
									>
										{isRefreshingToken ? (
											<>
												<RefreshCw className="h-4 w-4 animate-spin" />
												{t("common.refreshAccessTokenInProgress")}
											</>
										) : (
											<>
												<RefreshCw className="h-4 w-4" />
												{t("common.refreshAccessToken")}
											</>
										)}
									</Button>
								</div>

								<Button
									type="submit"
									disabled={isSubmitting || isRefreshingToken}
									className="flex w-full cursor-pointer items-center gap-2 sm:w-auto"
								>
									{isSubmitting ? (
										<>
											<RefreshCw className="h-4 w-4 animate-spin" />
											{t("common.saveButton.savingText")}
										</>
									) : (
										<>
											<Save className="h-4 w-4" />
											{t("common.saveButton.defaultText")}
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

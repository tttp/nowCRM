"use client";

import { AlertCircle, DollarSign, Info, Mail, RefreshCw } from "lucide-react";
import { useMessages } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getStatusColor,
	getStatusIcon,
} from "@/lib/static/healthCheckStatuses";
import type { SettingCredential } from "@/lib/types/new_type/settings";

interface EmailHealthCheckProps {
	email_credential: Omit<SettingCredential, "setting">;
}

export function EmailHealthCheck({ email_credential }: EmailHealthCheckProps) {
	const t = useMessages().Admin.Channels;

	const [isOpen, setIsOpen] = useState(false);
	const [isRunningCheck, setIsRunningCheck] = useState(false);

	const runHealthCheck = async () => {
		const { default: toast } = await import("react-hot-toast");
		setIsRunningCheck(true);
		//TODO: add here real health check
		setTimeout(() => {
			setIsRunningCheck(false);
			toast.success(t.email.toast.checked);
		}, 2000);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Card className="cursor-pointer transition-colors hover:bg-muted">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className=" rounded-full p-2">
									<Mail className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-medium">Email</h3>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full px-2 py-1 text-xs ${getStatusColor(email_credential.status)}`}
								>
									{email_credential.status}
								</span>
								{getStatusIcon(email_credential.status)}
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
														<Mail className="h-5 w-5 text-blue-500" />
														<h4 className="font-medium">
															{t.email.tooltip.title}
														</h4>
													</div>
													<p className="text-sm">
														{t.email.tooltip.description}
													</p>
													<div className="mt-2 border-gray-200 border-t pt-2 dark:border-gray-700">
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<DollarSign className="h-3.5 w-3.5" />
															<span>{t.email.tooltip.price}</span>
														</div>
														<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
															<AlertCircle className="h-3.5 w-3.5" />
															<span>{t.email.tooltip.limits}</span>
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
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t.email.title}</DialogTitle>
					<DialogDescription>{t.email.description}</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h4 className="font-medium">{t.common.status}</h4>
							<span
								className={`rounded-full px-2 py-1 text-xs ${getStatusColor(email_credential.status)}`}
							>
								{email_credential.status}
							</span>
						</div>

						{email_credential.status === "invalid" &&
							email_credential.error_message && (
								<div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3">
									<div className="flex items-start">
										<AlertCircle className="mt-0.5 mr-2 h-5 w-5 text-red-500" />
										<div>
											<h5 className="font-medium text-red-800 text-sm">
												{t.common.errorDetails}
											</h5>
											<p className="text-red-700 text-sm">
												{email_credential.error_message}
											</p>
										</div>
									</div>
								</div>
							)}
					</div>

					<div className="flex justify-end">
						<Button
							onClick={runHealthCheck}
							disabled={isRunningCheck}
							className="flex items-center gap-2"
						>
							{isRunningCheck ? (
								<>
									<RefreshCw className="h-4 w-4 animate-spin" />
									{t.email.runningCheck}
								</>
							) : (
								<>
									<RefreshCw className="h-4 w-4" />
									{t.common.runHealthCheck}
								</>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

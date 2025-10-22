"use client";
import { debounce } from "lodash";
import { Calendar, Clock, Info, Users, Zap } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Node } from "reactflow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import ContactsPageClient from "../contact-dialog/contactsDataTable";

// Provide default scheduled time fallback
const TIMING_CONFIG = {
	defaultScheduledTime: "09:00", // 9 AM default
};

type StepConfig = {
	enabled?: boolean;
	scheduledDate?: string;
	scheduledTime?: string;
};

interface SchedulerTriggerPanelProps {
	node: Node;
	updateNodeConfig: (config: any) => void;
	updateNodeLabel: (label: string) => void;
	updateNodeData: (data: Partial<any>) => void;
	onClose?: () => void;
}

export function SchedulerTriggerPanel({
	node,
	updateNodeConfig,
	updateNodeLabel,
}: SchedulerTriggerPanelProps) {
	const [config, setConfig] = useState<StepConfig>(() => ({
		enabled: node.data.config?.enabled !== false,
		scheduledDate:
			node.data.config?.scheduledDate || new Date().toISOString().split("T")[0],
		scheduledTime:
			node.data.config?.scheduledTime || TIMING_CONFIG.defaultScheduledTime,
	}));

	const [stepTitle, setStepTitle] = useState(
		() => node.data.label || "Schedule Trigger",
	);
	const isStartNode = node.id === "start" || node.data.label === "Start";

	// Reset when node changes
	useEffect(() => {
		setStepTitle(node.data.label || "Schedule Trigger");
		setConfig({
			enabled: node.data.config?.enabled !== false,
			scheduledDate:
				node.data.config?.scheduledDate ||
				new Date().toISOString().split("T")[0],
			scheduledTime:
				node.data.config?.scheduledTime || TIMING_CONFIG.defaultScheduledTime,
		});
	}, [node.id]);

	const handleConfigChange = useCallback((newConfig: Partial<StepConfig>) => {
		setConfig((prev) => {
			const updatedConfig = { ...prev, ...newConfig };
			debouncedUpdateNodeConfigRef.current(updatedConfig);
			return updatedConfig;
		});
	}, []);

	const debouncedUpdateLabelRef = useRef(
		debounce((newTitle: string) => {
			updateNodeLabel(newTitle);
		}, 300),
	);

	const debouncedUpdateNodeConfigRef = useRef(
		debounce((updatedConfig: StepConfig) => {
			updateNodeConfig(updatedConfig);
		}, 300),
	);

	useEffect(() => {
		return () => {
			debouncedUpdateNodeConfigRef.current.cancel();
			debouncedUpdateLabelRef.current.cancel();
		};
	}, []);

	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newTitle = e.target.value;
			setStepTitle(newTitle);
			debouncedUpdateLabelRef.current(newTitle);
		},
		[],
	);

	const getScheduledDateTime = () => {
		if (!config.scheduledDate || !config.scheduledTime) return null;

		const date = new Date(`${config.scheduledDate}T${config.scheduledTime}`);
		const now = new Date();
		const isUpcoming = date > now;

		return {
			date,
			isUpcoming,
			formatted: date.toLocaleString(undefined, {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	};

	const scheduledInfo = getScheduledDateTime();

	return (
		<div className="relative min-h-0 flex-1 overflow-hidden">
			<div className="h-full space-y-6 overflow-y-auto p-6">
				{/* Info Alert */}
				<Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
					<Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
					<AlertDescription className="text-amber-800 dark:text-amber-200">
						Scheduler triggers run automatically at the specified date and time.
					</AlertDescription>
				</Alert>

				{/* Trigger Configuration */}
				<Card>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<Zap className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg">Scheduler Trigger</CardTitle>
									<CardDescription>
										Automatically execute actions at a specific date and time
									</CardDescription>
								</div>
							</div>
							<Badge variant={config.enabled ? "default" : "secondary"}>
								{config.enabled ? "Active" : "Inactive"}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Step Title */}
						<div className="space-y-2">
							<Label htmlFor="step_title" className="font-medium text-sm">
								Scheduler Trigger Name
							</Label>
							<Input
								id="step_title"
								type="text"
								value={stepTitle}
								onChange={handleTitleChange}
								placeholder={
									isStartNode ? "Start" : "Enter Scheduler Trigger Name"
								}
								disabled={isStartNode}
								className="w-full"
							/>
						</div>

						<Separator />

						{/* Enable/Disable Toggle */}
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label className="font-medium text-sm">Enable Trigger</Label>
								<p className="text-muted-foreground text-xs">
									When enabled, this trigger will execute at the scheduled time
								</p>
							</div>
							<Switch
								checked={config.enabled}
								onCheckedChange={(enabled) => handleConfigChange({ enabled })}
							/>
						</div>

						{config.enabled && (
							<>
								<Separator />

								{/* Schedule Configuration */}
								<Card className="border-dashed">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-primary" />
												<CardTitle className="text-base">
													Schedule Configuration
												</CardTitle>
											</div>
											{scheduledInfo && (
												<Badge
													variant={
														scheduledInfo.isUpcoming ? "default" : "secondary"
													}
												>
													{scheduledInfo.isUpcoming ? "Upcoming" : "Past"}
												</Badge>
											)}
										</div>
										{scheduledInfo && (
											<CardDescription>
												Scheduled for: {scheduledInfo.formatted}
											</CardDescription>
										)}
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 gap-4">
											{/* Date Picker */}
											<div className="space-y-2">
												<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
													Date
												</Label>
												<div className="relative">
													<Input
														type="date"
														value={config.scheduledDate}
														onChange={(e) =>
															handleConfigChange({
																scheduledDate: e.target.value,
															})
														}
														min={new Date().toISOString().split("T")[0]}
														className="pl-3"
													/>
												</div>
											</div>

											{/* Time Picker */}
											<div className="space-y-2">
												<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
													Time
												</Label>
												<div className="relative">
													<Input
														type="time"
														value={config.scheduledTime}
														onChange={(e) =>
															handleConfigChange({
																scheduledTime: e.target.value,
															})
														}
														className="pl-3"
													/>
												</div>
											</div>
										</div>

										<div className="mt-4 rounded-lg bg-muted/50 p-3">
											<div className="flex items-start gap-2">
												<Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
												<div className="text-muted-foreground text-xs">
													<p className="mb-1 font-medium">How it works:</p>
													<p>
														This trigger will execute automatically at the
														specified date and time, regardless of when previous
														steps completed. Perfect for scheduled campaigns,
														reminders, or time-sensitive actions.
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
								<Card className="border-dashed">
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<Users className="h-4 w-4 text-primary" />
											Target Contacts
										</CardTitle>
										<CardDescription>
											Manage contacts for this step
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ContactsPageClient
											key={node.data.stepId}
											step_id={Number.parseInt(node.data.stepId)}
										/>
									</CardContent>
								</Card>

								{/* Status Information */}
								{scheduledInfo && !scheduledInfo.isUpcoming && (
									<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
										<Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
										<AlertDescription className="text-orange-800 dark:text-orange-200">
											The scheduled time has already passed. Consider updating
											to a future date and time.
										</AlertDescription>
									</Alert>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

"use client";
import { debounce } from "lodash";
import { Calendar, Clock, Info, Timer, Users } from "lucide-react";
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
import { cn } from "@/lib/utils";
import ContactsPageClient from "../contact-dialog/contactsDataTable";

type DelayConfig = {
	days: number;
	hours: number;
	minutes: number;
};

type StepConfig = {
	enabled?: boolean;
	delay?: DelayConfig;
	mode?: "delay" | "publish";
	scheduledDate?: string;
	scheduledTime?: string;
};

interface WaitPanelProps {
	node: Node;
	updateNodeConfig: (config: StepConfig) => void;
	updateNodeLabel: (label: string) => void;
	updateNodeData: (data: Partial<any>) => void;
	onClose?: () => void;
}

const DEFAULT_DELAY: DelayConfig = {
	days: 0,
	hours: 0,
	minutes: 0,
};

export function WaitPanel({
	node,
	updateNodeConfig,
	updateNodeLabel,
}: WaitPanelProps) {
	const [config, setConfig] = useState<StepConfig>(() => ({
		enabled: node.data.config?.enabled !== false,
		delay: node.data.config?.delay || { ...DEFAULT_DELAY },
		mode: node.data.config?.mode || "delay",
		scheduledDate:
			node.data.config?.scheduledDate || new Date().toISOString().split("T")[0],
		scheduledTime: node.data.config?.scheduledTime || "09:00",
	}));
	const [stepTitle, setStepTitle] = useState(() => node.data.label || "Wait");

	// Check if this is the start node
	const isStartNode = node.id === "start" || node.data.label === "Start";

	const debouncedUpdateLabelRef = useRef(
		debounce((title: string) => {
			updateNodeLabel(title);
		}, 300),
	);

	const debouncedUpdateConfigRef = useRef(
		debounce((updatedConfig: StepConfig) => {
			updateNodeConfig(updatedConfig);
		}, 300),
	);

	useEffect(() => {
		return () => {
			debouncedUpdateLabelRef.current.cancel();
			debouncedUpdateConfigRef.current.cancel();
		};
	}, []);

	useEffect(() => {
		setStepTitle(node.data.label || "Wait");
		setConfig({
			enabled: node.data.config?.enabled !== false,
			delay: node.data.config?.delay || { ...DEFAULT_DELAY },
			mode: node.data.config?.mode || "delay",
			scheduledDate:
				node.data.config?.scheduledDate ||
				new Date().toISOString().split("T")[0],
			scheduledTime: node.data.config?.scheduledTime || "09:00",
		});
	}, [node.id]);

	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newTitle = e.target.value;
			setStepTitle(newTitle);
			if (!isStartNode) {
				debouncedUpdateLabelRef.current(newTitle);
			}
		},
		[isStartNode],
	);

	const handleDelayChange = useCallback(
		(key: keyof DelayConfig, rawValue: number) => {
			const value = Number.isNaN(rawValue) ? 0 : rawValue;
			const currentDelay = {
				days: config.delay?.days ?? 0,
				hours: config.delay?.hours ?? 0,
				minutes: config.delay?.minutes ?? 0,
			};
			const updatedDelay = { ...currentDelay, [key]: value };
			const updatedConfig: StepConfig = { ...config, delay: updatedDelay };
			setConfig(updatedConfig);
			debouncedUpdateConfigRef.current(updatedConfig);
		},
		[config],
	);

	const handleEnabledChange = useCallback(
		(enabled: boolean) => {
			const updatedConfig = { ...config, enabled };
			setConfig(updatedConfig);
			debouncedUpdateConfigRef.current(updatedConfig);
		},
		[config],
	);

	const handleModeChange = useCallback(
		(mode: "delay" | "publish") => {
			const updatedConfig = { ...config, mode };
			setConfig(updatedConfig);
			debouncedUpdateConfigRef.current(updatedConfig);
		},
		[config],
	);

	const handleConfigUpdate = useCallback(
		(newValues: Partial<StepConfig>) => {
			const updatedConfig = { ...config, ...newValues };
			setConfig(updatedConfig);
			debouncedUpdateConfigRef.current(updatedConfig);
		},
		[config],
	);

	const getTotalDelayText = () => {
		const { days = 0, hours = 0, minutes = 0 } = config.delay || {};
		const parts = [];
		if (days > 0) parts.push(`${days}d`);
		if (hours > 0) parts.push(`${hours}h`);
		if (minutes > 0) parts.push(`${minutes}m`);
		return parts.length > 0 ? parts.join(" ") : "No delay";
	};

	const getTooltipContent = () => {
		if (config.mode === "publish") {
			return "If a user reaches this wait node after the scheduled date and time, they will immediately receive the action messages and continue to the next step without waiting.";
		} else {
			return "If a user reaches this wait node after the configured delay period has already passed, they will immediately receive the action messages and continue to the next step without waiting.";
		}
	};
	return (
		<div className="relative min-h-0 flex-1 overflow-hidden">
			<div className="h-full space-y-6 overflow-y-auto p-6">
				<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
					<Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<AlertDescription className="text-blue-800 dark:text-blue-200">
						{getTooltipContent()}
					</AlertDescription>
				</Alert>

				{/* Step Configuration */}
				<Card>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-lg">
									Wait Step Configuration
								</CardTitle>
								<CardDescription>
									Configure how long to wait before proceeding to the next step
								</CardDescription>
							</div>
							<Badge variant={config.enabled ? "default" : "secondary"}>
								{config.enabled ? "Enabled" : "Disabled"}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Step Title */}
						<div className="space-y-2">
							<Label htmlFor="step_title" className="font-medium text-sm">
								Step Title
							</Label>
							<Input
								id="step_title"
								type="text"
								value={stepTitle}
								onChange={handleTitleChange}
								placeholder={isStartNode ? "Start" : "Enter Wait Step Title"}
								disabled={isStartNode}
								className="w-full"
							/>
						</div>

						<Separator />

						{/* Enable/Disable Toggle */}
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label className="font-medium text-sm">Enable Wait Step</Label>
								<p className="text-muted-foreground text-xs">
									Toggle to enable or disable this wait step
								</p>
							</div>
							<Switch
								checked={config.enabled}
								onCheckedChange={handleEnabledChange}
								disabled={isStartNode}
							/>
						</div>

						{config.enabled && (
							<>
								<Separator />

								{/* Wait Mode Selection */}
								<div className="space-y-3">
									<Label className="font-medium text-sm">Wait Mode</Label>
									<div className="grid grid-cols-2 gap-2">
										<button
											type="button"
											className={cn(
												"flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium text-sm transition-all",
												config.mode === "delay"
													? "border-primary bg-primary text-primary-foreground shadow-sm"
													: "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
											)}
											onClick={() => handleModeChange("delay")}
										>
											<Timer className="h-4 w-4" />
											Delay
										</button>
										<button
											type="button"
											className={cn(
												"flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium text-sm transition-all",
												config.mode === "publish"
													? "border-primary bg-primary text-primary-foreground shadow-sm"
													: "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
											)}
											onClick={() => handleModeChange("publish")}
										>
											<Calendar className="h-4 w-4" />
											Specific Time
										</button>
									</div>
								</div>

								{/* Delay Configuration */}
								{config.mode === "delay" && (
									<Card className="border-dashed">
										<CardHeader className="pb-3">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-primary" />
												<CardTitle className="text-base">
													Delay Configuration
												</CardTitle>
											</div>
											<CardDescription>
												Set how long to wait before proceeding • Current:{" "}
												{getTotalDelayText()}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-3 gap-4">
												<div className="space-y-2">
													<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Days
													</Label>
													<Input
														type="number"
														min={0}
														value={config.delay?.days ?? 0}
														onChange={(e) =>
															handleDelayChange(
																"days",
																parseInt(e.target.value) || 0,
															)
														}
														className="text-center"
													/>
												</div>
												<div className="space-y-2">
													<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Hours
													</Label>
													<Input
														type="number"
														min={0}
														max={23}
														value={config.delay?.hours ?? 0}
														onChange={(e) =>
															handleDelayChange(
																"hours",
																parseInt(e.target.value) || 0,
															)
														}
														className="text-center"
													/>
												</div>
												<div className="space-y-2">
													<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Minutes
													</Label>
													<Input
														type="number"
														min={0}
														max={59}
														value={config.delay?.minutes ?? 0}
														onChange={(e) =>
															handleDelayChange(
																"minutes",
																parseInt(e.target.value) || 0,
															)
														}
														className="text-center"
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								)}

								{/* Specific Time Configuration */}
								{config.mode === "publish" && (
									<Card className="border-dashed">
										<CardHeader className="pb-3">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-primary" />
												<CardTitle className="text-base">
													Schedule Configuration
												</CardTitle>
											</div>
											<CardDescription>
												Set a specific date and time to proceed
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Date
													</Label>
													<Input
														type="date"
														value={config.scheduledDate}
														onChange={(e) =>
															handleConfigUpdate({
																scheduledDate: e.target.value,
															})
														}
													/>
												</div>
												<div className="space-y-2">
													<Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
														Time
													</Label>
													<Input
														type="time"
														value={config.scheduledTime}
														onChange={(e) => {
															console.log(e.target.value);
															handleConfigUpdate({
																scheduledTime: e.target.value,
															});
														}}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								)}
							</>
						)}
						<Card className="border-dashed">
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center gap-2 text-base">
									<Users className="h-4 w-4 text-primary" />
									Target Contacts
								</CardTitle>
								<CardDescription>Manage contacts for this step</CardDescription>
							</CardHeader>
							<CardContent>
								<ContactsPageClient
									key={node.data.stepId}
									step_id={Number.parseInt(node.data.stepId)}
								/>
							</CardContent>
						</Card>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

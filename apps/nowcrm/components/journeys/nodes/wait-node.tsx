"use client";

import { AlertCircle, Clock, Plus, Power, PowerOff } from "lucide-react";
import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { cn } from "@/lib/utils";

const NODE_CONFIG = {
	minWidth: "280px",
	borderWidth: "2px",
	iconSize: "h-5 w-5",
	handleSize: "!h-3 !w-3",
};

export const WaitNode = memo(
	({ data, isConnectable, id, selected }: NodeProps) => {
		const isEnabled = data.config?.enabled !== false;
		const isStartNode =
			data.isStart || id === "start" || data.label === "Start";

		const delay = {
			days: data.config?.delay?.days ?? 0,
			hours: data.config?.delay?.hours ?? 0,
			minutes: data.config?.delay?.minutes ?? 0,
		};

		const timingType = data.config?.mode;
		// Determine if this is a specific time or delay
		const isSpecificTime = timingType === "publish";

		const scheduledAt =
			isSpecificTime && data.config?.scheduledDate && data.config?.scheduledTime
				? new Date(`${data.config.scheduledDate}T${data.config.scheduledTime}`)
				: null;

		const isConfigured = isSpecificTime
			? !!scheduledAt
			: delay.days > 0 || delay.hours > 0 || delay.minutes > 0;

		const getDelayText = () => {
			if (isSpecificTime && scheduledAt) {
				const date = scheduledAt.toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				});
				const time = scheduledAt.toLocaleTimeString(undefined, {
					hour: "2-digit",
					minute: "2-digit",
				});
				return `Scheduled for ${date} at ${time}`;
			}

			const parts: string[] = [];

			if (delay.days > 0)
				parts.push(`${delay.days} day${delay.days !== 1 ? "s" : ""}`);
			if (delay.hours > 0)
				parts.push(`${delay.hours} hour${delay.hours !== 1 ? "s" : ""}`);
			if (delay.minutes > 0)
				parts.push(`${delay.minutes} minute${delay.minutes !== 1 ? "s" : ""}`);

			return parts.length ? `Waits ${parts.join(", ")}` : "No delay defined";
		};

		const getBorderColor = () => {
			if (!isEnabled) return "border-gray-400 dark:border-gray-500";
			if (isStartNode) {
				return isEnabled
					? "border-amber-400 dark:border-amber-500 border-4"
					: "border-gray-400 dark:border-gray-500 border-4";
			}
			if (isConfigured) return "border-blue-500 dark:border-blue-400";
			return "border-border";
		};

		const getSelectedStyling = () =>
			selected ? "border-primary shadow-lg ring-4 ring-primary/20" : "";

		const getNodeOpacity = () => (isEnabled ? "opacity-100" : "opacity-60");

		// Handle plus icon click
		const handlePlusClick = (event: React.MouseEvent) => {
			event.stopPropagation();
			// Dispatch custom event to trigger node creation
			const customEvent = new CustomEvent("createNodeFromPlus", {
				detail: { sourceNodeId: id },
			});
			window.dispatchEvent(customEvent);
		};

		const hasContacts = data.hasContacts === true;

		return (
			<div
				className={cn(
					`group min-w-[${NODE_CONFIG.minWidth}] relative rounded-md border-2 bg-card p-4 pr-10 shadow-sm transition-all duration-200`,
					getBorderColor(),
					getSelectedStyling(),
					getNodeOpacity(),
				)}
			>
				{/* Left handle - only for non-start nodes */}
				{!isStartNode && (
					<Handle
						type="target"
						position={Position.Left}
						isConnectable={isConnectable}
						className={cn(NODE_CONFIG.handleSize, "!bg-muted-foreground")}
					/>
				)}
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="font-medium text-base text-foreground">
							{data.label || "Wait"}
						</div>
						<div className="flex items-center">
							{isEnabled ? (
								<Power className="h-3 w-3 text-green-500" />
							) : (
								<PowerOff className="h-3 w-3 text-gray-500" />
							)}
						</div>
					</div>

					<Clock
						className={cn(
							NODE_CONFIG.iconSize,
							isEnabled ? "text-blue-500" : "text-gray-400",
						)}
					/>
				</div>

				{/* Info Section */}
				<div className="mt-3 space-y-2 text-sm">
					{isConfigured ? (
						<div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
							<Clock className="h-4 w-4" />
							<span>{getDelayText()}</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-4 w-4" />
							<span>No delay configured</span>
						</div>
					)}

					{hasContacts ? (
						<div className="flex items-center gap-2 text-muted-foreground">
							<span>has contacts on step</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-muted-foreground">
							<span>No contacts on step</span>
						</div>
					)}

					<div className="flex items-center gap-2 text-muted-foreground">
						<span className="text-xs">
							{isEnabled
								? "Step will pause before continuing"
								: "Wait step is disabled"}
						</span>
					</div>

					{!isEnabled && (
						<div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
							<AlertCircle className="h-4 w-4" />
							<span className="text-xs">This wait is disabled</span>
						</div>
					)}
				</div>

				{/* Right handle */}
				<Handle
					type="source"
					position={Position.Right}
					isConnectable={isConnectable}
					className={cn(
						NODE_CONFIG.handleSize,
						isEnabled ? "!bg-blue-500" : "!bg-gray-400",
					)}
					style={{ zIndex: 1020 }}
				/>
				{/* Plus icon for adding new nodes */}
				<div
					className="-right-10 -translate-y-1/2 absolute top-1/2 cursor-pointer opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100"
					onClick={handlePlusClick}
					style={{ zIndex: 1000 }}
				>
					<div
						className="-translate-y-1/2 absolute top-1/2 left-[-24px] h-px w-[24px] border-primary border-t border-dashed"
						aria-hidden
					/>

					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90">
						<Plus className="h-2 w-2" />
					</div>
				</div>
			</div>
		);
	},
);

WaitNode.displayName = "WaitNode";

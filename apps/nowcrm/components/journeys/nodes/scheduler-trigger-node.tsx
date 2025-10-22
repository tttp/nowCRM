"use client";

import { AlertCircle, Calendar, Plus, Power, PowerOff } from "lucide-react";
import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { cn } from "@/lib/utils";

const NODE_CONFIG = {
	minWidth: "280px",
	borderWidth: "2px",
	iconSize: "h-5 w-5",
	handleSize: "!h-3 !w-3",
};

export const SchedulerTriggerNode = memo(
	({ data, isConnectable, id, selected }: NodeProps) => {
		const isStartNode =
			data.isStart || id === "start" || data.label === "Start";
		const isEnabled = data.config?.enabled !== false;

		// Use scheduledDate + scheduledTime from config
		const hasScheduleInfo =
			!!data.config?.scheduledDate && !!data.config?.scheduledTime;

		const isFullyConfigured = hasScheduleInfo;

		const getScheduleDisplay = () => {
			if (!hasScheduleInfo) return "No scheduled time defined";

			const date = data.config.scheduledDate;
			const time = data.config.scheduledTime;

			const [hour = "00", minute = "00"] = time.split(":");
			const formattedTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

			return `Triggers at ${date} ${formattedTime}`;
		};

		const getBorderColor = () => {
			if (isStartNode) {
				return isEnabled
					? "border-amber-400 dark:border-amber-500 border-4"
					: "border-gray-400 dark:border-gray-500 border-4";
			}
			if (!isEnabled) return "border-gray-400 dark:border-gray-500";
			if (isFullyConfigured) return "border-green-500 dark:border-green-400";
			return "border-border";
		};

		const getSelectedStyling = () => {
			return selected ? "border-primary shadow-lg ring-4 ring-primary/20" : "";
		};

		const getNodeOpacity = () => {
			return isEnabled ? "opacity-100" : "opacity-60";
		};

		// Handle plus icon click
		const handlePlusClick = (event: React.MouseEvent) => {
			event.stopPropagation();
			// Dispatch custom event to trigger node creation
			const customEvent = new CustomEvent("createNodeFromPlus", {
				detail: { sourceNodeId: id },
			});
			window.dispatchEvent(customEvent);
		};

		return (
			<div
				className={cn(
					`group min-w-[${NODE_CONFIG.minWidth}] rounded-md border-2 bg-card p-4 shadow-sm transition-all duration-200`,
					getBorderColor(),
					getSelectedStyling(),
					getNodeOpacity(),
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="font-medium text-base text-foreground">
							{isStartNode ? "Start" : data.label || "Trigger"}
						</div>

						{isStartNode && (
							<span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800 text-xs">
								Entry Point
							</span>
						)}

						{!isStartNode && (
							<div className="flex items-center">
								{isEnabled ? (
									<Power className="h-3 w-3 text-green-500" />
								) : (
									<PowerOff className="h-3 w-3 text-gray-500" />
								)}
							</div>
						)}
					</div>

					<Calendar
						className={cn(
							NODE_CONFIG.iconSize,
							isEnabled ? "text-green-500" : "text-gray-400",
						)}
					/>
				</div>

				{/* Info Section */}
				<div className="mt-3 space-y-2 text-sm">
					{hasScheduleInfo ? (
						<div className="flex items-center gap-2 text-green-500 dark:text-green-400">
							<Calendar className="h-4 w-4" />
							<span>{getScheduleDisplay()}</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-4 w-4" />
							<span>No scheduled time defined</span>
						</div>
					)}

					<div className="flex items-center gap-2 text-muted-foreground">
						<span className="text-xs">
							{isStartNode
								? "Primary entry point - always active"
								: isEnabled
									? "Secondary trigger - active"
									: "Secondary trigger - inactive"}
						</span>
					</div>

					{!isStartNode && !isEnabled && (
						<div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
							<AlertCircle className="h-4 w-4" />
							<span className="text-xs">This trigger is disabled</span>
						</div>
					)}
				</div>

				{/* Connection Handle */}
				<Handle
					type="source"
					position={Position.Right}
					isConnectable={isConnectable}
					className={cn(
						NODE_CONFIG.handleSize,
						isEnabled ? "!bg-amber-500" : "!bg-gray-400",
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

SchedulerTriggerNode.displayName = "SchedulerTriggerNode";

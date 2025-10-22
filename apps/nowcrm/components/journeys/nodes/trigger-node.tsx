import { Plus, Power, PowerOff, Zap } from "lucide-react";
import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { cn } from "@/lib/utils";

// Support for object-shaped events, same as TriggerPanel
export type EventValue =
	| "entry.create"
	| "entry.update"
	| "entry.unpublish"
	| {
			label: "entry.create" | "entry.update" | "entry.unpublish";
			attribute?: string | null;
			attribute_value?: boolean | string | number | null;
			// legacy misspelling kept for backward compatibility
			atturbute_value?: boolean | string | number | null;
	  };

const NODE_CONFIG = {
	minWidth: "280px",
	borderWidth: "2px",
	iconSize: "h-5 w-5",
	handleSize: "!h-3 !w-3",
} as const;

// Helpful renderer for the summary
const renderEventSummary = (ev?: EventValue): string => {
	if (!ev) return "";
	if (typeof ev === "string") return ev;
	const v = ev.attribute_value ?? ev.atturbute_value;
	return ev.attribute != null && v !== undefined
		? `${ev.label} (${ev.attribute} = ${String(v)})`
		: ev.label;
};

export const TriggerNode = memo(
	({ data, isConnectable, id, selected }: NodeProps) => {
		const isStartNode =
			data.isStart || id === "start" || data.label === "Start";
		const isEnabled = data.config?.enabled !== false;

		// Consider configuration complete when event exists and either
		// a) entity is not "action" or
		// b) entity is "action" and attribute exists
		const isConfigured =
			!!data.config?.entity &&
			!!data.config?.event &&
			(data.config.entity !== "action" || !!data.config?.attribute);

		const getBorderColor = () => {
			if (isStartNode) {
				return isEnabled
					? "border-amber-400 dark:border-amber-500 border-4"
					: "border-gray-400 dark:border-gray-500 border-4";
			}
			if (!isEnabled) return "border-gray-400 dark:border-gray-500";
			if (isConfigured) return "border-green-500 dark:border-green-400";
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
					`group relative rounded-md border-2 bg-card p-4 pr-10 shadow-sm transition-all duration-200`,
					getBorderColor(),
					getSelectedStyling(),
					getNodeOpacity(),
				)}
				// Tailwind cannot see dynamic arbitrary values at runtime; use inline style
				style={{ minWidth: NODE_CONFIG.minWidth }}
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
					<Zap
						className={cn(
							NODE_CONFIG.iconSize,
							isEnabled ? "text-amber-500" : "text-gray-400",
						)}
					/>
				</div>

				{/* Config Summary */}
				<div className="mt-3 space-y-1 text-muted-foreground text-sm">
					{data.config?.entity && (
						<div>
							<strong>Entity:</strong> {String(data.config.entity)}
						</div>
					)}

					{data.config?.entity === "action" && data.config?.attribute && (
						<div>
							<strong>Action Type:</strong>{" "}
							{data.config.attribute.label || data.config.attribute.value}
						</div>
					)}

					{data.config?.event && (
						<div>
							<strong>Event:</strong>{" "}
							{renderEventSummary(data.config.event as EventValue)}
						</div>
					)}

					<div>
						{isStartNode
							? "Primary entry point - always active"
							: isEnabled
								? "Secondary trigger - active"
								: "Secondary trigger - inactive"}
					</div>
				</div>

				{/* Optional disabled warning */}
				{!isStartNode && !isEnabled && (
					<div className="mt-2 text-amber-600 text-xs dark:text-amber-400">
						This trigger is disabled
					</div>
				)}

				{/* Right handle - all trigger nodes can connect to others */}
				<Handle
					id="default"
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

TriggerNode.displayName = "TriggerNode";

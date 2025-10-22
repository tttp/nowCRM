"use client";

import {
	AlertCircle,
	AlertTriangle,
	LinkedinIcon as BrandLinkedin,
	Check,
	Clock,
	Globe,
	Linkedin,
	Mail,
	MessageCircle,
	MessageSquare,
	PieChart,
	Plus,
	Send,
	Twitter,
	UserIcon,
	UserPlus,
	Users,
} from "lucide-react";
import type React from "react";
import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";

import { cn } from "@/lib/utils";

// Define channel icons based on categories
const channelIcons = {
	// P2P Channels
	email: Mail,
	sms: MessageSquare,
	whatsapp: MessageCircle,
	"linkedin-messaging": Linkedin,
	"linkedin-invitations": UserPlus,

	// B2C Channels
	linkedin: BrandLinkedin,
	twitter: Twitter,
	telegram: Send,
	blog: Globe,

	// Other step types
	wait: Clock,
	segment: Users,
	conversion: PieChart,
	fallback: AlertTriangle,
	pending: Mail, // Default icon for pending nodes
};

const NODE_CONFIG = {
	minWidth: "280px",
	borderWidth: "2px",
	iconSize: "h-5 w-5",
	handleSize: "!h-3 !w-3",
};

export const ChannelNode = memo(
	({ data, isConnectable, id, selected }: NodeProps) => {
		// Get the appropriate icon based on channel or step type
		const getIcon = () => {
			// If the node has a channel defined, use that icon
			if (
				data.config?.channel &&
				channelIcons[data.config.channel as keyof typeof channelIcons]
			) {
				return channelIcons[data.config.channel as keyof typeof channelIcons];
			}

			// Otherwise fall back to the step type icon
			return channelIcons[data.type as keyof typeof channelIcons] || Mail;
		};

		const Icon = getIcon();

		// Check if this is the start node - either by label or by id
		const isStartNode =
			data.label === "Start" || data.label === "start" || id === "start";

		// Check if this is a fallback node
		const isFallbackNode = data.type === "fallback";

		// Check if all required configurations are complete
		const hasComposition =
			data.config?.composition && data.config.composition.value !== "";
		const hasIdentity =
			data.config?.identity && data.config.identity.value !== "";
		const hasContacts = data.hasContacts === true;

		// Step is fully configured if all required items are set
		const isFullyConfigured = hasComposition && hasIdentity && hasContacts;

		// Get border color based on node state
		const getBorderColor = () => {
			if (isStartNode) return "border-amber-300 dark:border-amber-400";
			if (isFallbackNode) return "border-orange-400 dark:border-orange-500";
			if (isFullyConfigured) return "border-green-500 dark:border-green-400";
			return "border-border";
		};

		// Get selected state styling
		const getSelectedStyling = () => {
			if (selected) {
				return "border-primary shadow-lg ring-4 ring-primary/20";
			}
			return "";
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
				key={`node-${id}-${selected ? "selected" : "normal"}`}
				className={cn(
					`group min-w-[${NODE_CONFIG.minWidth}] relative rounded-md border-2 bg-card p-4 pr-10 shadow-sm transition-all duration-200`,
					data.type === "pending" && "border-dashed",
					getBorderColor(),
					getSelectedStyling(),
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

				<div className="flex items-center justify-between">
					<div className="font-medium text-base text-foreground">
						{data.label === "email"
							? "New Journey step"
							: data.label === "start"
								? "Start"
								: data.label}
					</div>
					{Icon && (
						<Icon
							className={cn(
								NODE_CONFIG.iconSize,
								isFallbackNode
									? "text-orange-500 dark:text-orange-400"
									: "text-muted-foreground",
							)}
						/>
					)}
				</div>

				<div className="mt-3 space-y-2 text-sm">
					{isFallbackNode && (
						<div className="flex items-center gap-2 text-orange-500 dark:text-orange-400">
							<AlertTriangle className="h-4 w-4" />
							<span>
								Fallback after {data.config?.fallbackDelay || "24"} hours
							</span>
						</div>
					)}

					{hasContacts ? (
						<div className="flex items-center gap-2 text-green-500 dark:text-green-400">
							<Check className="h-4 w-4" />
							<span>Contacts selected</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-muted-foreground">
							<UserIcon className="h-4 w-4" />
							<span>No contacts selected</span>
						</div>
					)}

					{hasComposition ? (
						<div className="flex items-center gap-2 text-green-500 dark:text-green-400">
							<Check className="h-4 w-4" />
							<span>Composition selected</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-4 w-4" />
							<span>Missing composition</span>
						</div>
					)}

					{(data.config.channel?.label?.toString()?.toLowerCase() === "email" ||
						data.config.channel?.label?.toString()?.toLowerCase() ===
							"linkedin-messaging" ||
						data.config.channel?.label?.toString()?.toLowerCase() ===
							"linkedin-invitations") &&
						(hasIdentity ? (
							<div className="flex items-center gap-2 text-green-500 dark:text-green-400">
								<Check className="h-4 w-4" />
								<span>Identity configured</span>
							</div>
						) : (
							<div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
								<AlertCircle className="h-4 w-4" />
								<span>Missing identity</span>
							</div>
						))}
				</div>

				{/* Right handle - for all nodes */}
				<Handle
					type="source"
					position={Position.Right}
					isConnectable={isConnectable}
					className={cn(NODE_CONFIG.handleSize, "!bg-muted-foreground")}
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

ChannelNode.displayName = "ChannelNode";

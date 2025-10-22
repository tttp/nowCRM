"use client";

import { Calendar, Clock, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepType = "trigger" | "scheduler-trigger" | "wait" | "channel";

const stepTypes: {
	type: StepType;
	label: string;
	icon: React.ElementType;
	description: string;
	color: string;
	iconColor: string;
}[] = [
	{
		type: "trigger",
		label: "Trigger",
		icon: Zap,
		description: "Start journey when conditions are met",
		color:
			"border-orange-200 bg-orange-50 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/20 dark:hover:bg-orange-950/40",
		iconColor: "text-orange-500",
	},
	{
		type: "scheduler-trigger",
		label: "Schedule Trigger",
		icon: Calendar,
		description: "Start journey on a scheduled basis",
		color:
			"border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/20 dark:hover:bg-blue-950/40",
		iconColor: "text-blue-500",
	},
	{
		type: "wait",
		label: "Wait",
		icon: Clock,
		description: "Start journey after a delay",
		color:
			"border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/40",
		iconColor: "text-yellow-500",
	},
	{
		type: "channel",
		label: "Channel",
		icon: Mail,
		description: "Send messages via email, SMS, etc.",
		color:
			"border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/20 dark:hover:bg-green-950/40",
		iconColor: "text-green-500",
	},
];

interface StepSelectorPanelProps {
	onSelect: (type: StepType) => void;
	onClose: () => void;
}

export function StepSelectorPanel({ onSelect }: StepSelectorPanelProps) {
	return (
		<div className="relative min-h-0 flex-1 overflow-hidden">
			<div className="h-full overflow-y-auto p-6">
				<div className="mb-4">
					<h2 className="font-semibold text-base text-foreground">
						Select Node Type
					</h2>
					<p className="mt-1 text-muted-foreground text-sm">
						Choose the type of node you want to create. This will determine how
						your journey starts and what configuration options are available.
					</p>
				</div>

				<div className="space-y-3">
					{stepTypes.map((step) => (
						<Button
							key={step.type}
							onClick={() => onSelect(step.type)}
							variant="outline"
							className={cn(
								"flex h-auto w-full items-start justify-start gap-3 rounded-md border-2 p-4 text-left transition-all duration-200",
								step.color,
							)}
							title={step.label}
						>
							<div className="mt-0.5 flex-shrink-0 rounded-full bg-white p-1.5 shadow-sm dark:bg-gray-800">
								<step.icon className={cn("h-4 w-4", step.iconColor)} />
							</div>
							<div className="flex-1">
								<div className="font-medium text-foreground text-sm">
									{step.label}
								</div>
								<div className="mt-0.5 text-muted-foreground text-xs">
									{step.description}
								</div>
							</div>
						</Button>
					))}
				</div>

				<div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
					<div className="flex items-start gap-2">
						<div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
						<div>
							<h4 className="font-medium text-blue-900 text-xs dark:text-blue-100">
								Getting Started
							</h4>
							<p className="mt-0.5 text-blue-800 text-xs dark:text-blue-200">
								After selecting a node type, you'll be able to configure its
								specific settings in the panel that appears. You can always
								change the configuration later by selecting the node.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

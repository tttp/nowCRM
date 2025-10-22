"use client";

import { ArrowDown, ArrowRight, ArrowUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type Branch = {
	id: string;
	sourceNodeId: string;
	targetNodeId: string;
	targetNodeLabel: string;
	label: string;
	conditions: any[];
	condition_type: "all" | "any";
	priority: number;
	connectionId: number;
};

interface BranchingTabProps {
	branches: Branch[];
	moveBranchUp: (branchId: string) => void;
	moveBranchDown: (branchId: string) => void;
}

export function BranchingTab({
	branches,
	moveBranchUp,
	moveBranchDown,
}: BranchingTabProps) {
	if (branches.length === 0) {
		return (
			<div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
				<div className="flex items-start gap-3">
					<Info className="h4 w4 text-blue-800" />
					<div>
						<h4 className="font-medium text-blue-800 text-sm dark:text-blue-200">
							No Branches Connected
						</h4>
						<p className="mt-1 text-blue-700 text-xs dark:text-blue-300">
							Connect this step to other steps to create branches. Once
							connected, you can set the priority order in which branches are
							evaluated.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (branches.length === 1) {
		return (
			<div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
				<div className="flex items-start gap-3">
					<Info className="h4 w4 text-blue-800" />
					<div>
						<h4 className="font-medium text-blue-800 text-sm dark:text-blue-200">
							About Branching Priority
						</h4>
						<p className="mt-1 text-blue-700 text-xs dark:text-blue-300">
							When multiple branches are connected, they’re evaluated in order.
							The first branch with conditions that match will be followed.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<h3 className="mb-2 font-medium text-base text-foreground">
				Branching Priority Order
			</h3>
			<p className="mb-4 text-muted-foreground text-sm">
				Lower numbers are evaluated first. You can reorder them.
			</p>

			<div className="space-y-2">
				{branches.map((branch, index) => (
					<div
						key={branch.id}
						className="flex items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
							{branch.priority}
						</div>
						<div className="flex-grow">
							<div className="flex items-center gap-2 font-medium text-foreground">
								{branch.label || `Branch ${index + 1}`}
								<ArrowRight className="h-3 w-3 text-muted-foreground" />
								<span className="text-muted-foreground text-sm">
									{branch.targetNodeLabel}
								</span>
							</div>
							<div className="mt-1 text-muted-foreground text-xs">
								{branch.conditions?.length > 0
									? `${branch.conditions.length} condition${branch.conditions.length !== 1 ? "s" : ""} (${branch.condition_type === "all" ? "AND" : "OR"})`
									: "No conditions (default path)"}
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() => moveBranchUp(branch.id)}
								disabled={index === 0}
								title="Move up"
							>
								<ArrowUp className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() => moveBranchDown(branch.id)}
								disabled={index === branches.length - 1}
								title="Move down"
							>
								<ArrowDown className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
				<div className="flex items-start gap-3">
					<Info className="h4 w4 text-blue-800" />
					<div>
						<h4 className="font-medium text-blue-800 text-sm dark:text-blue-200">
							About Branching Priority
						</h4>
						<p className="mt-1 text-blue-700 text-xs dark:text-blue-300">
							The first matching branch will be followed. Use the arrows to
							reorder priority.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

"use client";

import { SlidersHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { JSX } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Define the props type for the MassActionsComponent.
// This type will be used by the getExtraData function in ActionConfig.
export type MassActionsComponentProps = {
	selectedRows: number[];
	clearFunction: () => void;
	dropdownModal?: boolean;
	refreshData?: () => void;
	journeyStepId?: number; // Added for your specific use case
	jwt?: string; // Added for your specific use case
	[key: string]: any; // Allows for other dynamic props to be passed
};

// Define the configuration interface for each action.
export interface ActionConfig {
	/** The label shown in the dropdown */
	label: string;
	labelWithFilters?: string;
	/** Whether the action requires additional input via a dialog */
	requiresDialog?: boolean;
	selectedOptionNeeded?: boolean;
	/**
	 * A function that renders the dialog content.
	 * It receives an object containing the current selected option, setter, and any extra props (like t or jwt)
	 */
	dialogContent?: (params: {
		selectedOption: any;
		setSelectedOption: (val: any) => void;
		selectedRows: number[];
	}) => JSX.Element;
	dialogContentWithFilters?: (params: {
		selectedOption: any;
		setSelectedOption: (val: any) => void;
		filters: any;
		setFilters: (val: any) => void;
		closeDialog: (val: boolean) => void;
		setDialogNeeded: (val: boolean) => void;
		onSubmit?: (
			filters: Record<string, any>,
		) => Promise<{ success: boolean; errorMessage?: string }>;
	}) => JSX.Element;
	onFilterActionWithoutApprove?: (filters: Record<string, any>) => Promise<{
		success: boolean;
		errorMessage?: string;
	}>;
	/** Label for the dialog's submit button (if applicable) */
	dialogSubmitLabel?: string;
	/**
	 * Callback that performs the action.
	 * It receives the array of selected rows and an optional extra parameter (for example, the value from the dialog)
	 */
	onAction: (
		selectedRows: number[],
		extra?: any,
	) => Promise<{ success: boolean; errorMessage?: string }>;
	onFilterAction?: (
		filters: Record<string, any>,
		selectedOption: any,
	) => Promise<{ success: boolean; errorMessage?: string }>;
	/** Optional success toast message */
	successMessage?: string;
	/** Optional error toast message */
	errorMessage?: string;
	modal?: boolean; // Added modal property
	/**
	 * A function to dynamically get extra data for onAction.
	 * It receives the props of the MassActionsComponent.
	 * This takes precedence over defaultExtraData if both are provided.
	 */
	getExtraData?: (componentProps: MassActionsComponentProps) => any;
	/** Optional static extra data to pass to onAction for non-dialog actions.
	 *  This is overridden by getExtraData if both are provided.
	 */
	defaultExtraData?: any;
}

// Generator configuration type mapping unique keys to action configuration.
export type ActionsConfig = {
	[actionKey: string]: ActionConfig;
};

// The generator function creates a new component based on the provided configuration.
export function massActionsGenerator(actionsConfig: ActionsConfig) {
	return function MassActionsComponent({
		selectedRows,
		clearFunction,
		dropdownModal = false,
		refreshData,
		...restProps // Capture all other props passed to MassActionsComponent
	}: MassActionsComponentProps) {
		const router = useRouter();
		const params = useParams<{ locale: string; id: string }>();
		const [isDialogOpen, setIsDialogOpen] = useState(false);
		const [currentActionKey, setCurrentActionKey] = useState<string | null>(
			null,
		);
		const [selectedOption, setSelectedOption] = useState<any>(null);
		const [filters, setFilters] = useState<any>(null); // used for advanced filters handling
		const [dialogNeeded, setDialogNeeded] = useState<boolean>(true);

		// When an action is selected
		const handleActionClick = (actionKey: string) => {
			const action = actionsConfig[actionKey];
			if (action.requiresDialog) {
				setCurrentActionKey(actionKey);
				setIsDialogOpen(true);
				setDialogNeeded(selectedRows.length > 0);
			} else {
				let extraDataForAction: any = action.defaultExtraData; // Start with static defaultExtraData
				if (action.getExtraData) {
					// If a dynamic getter exists, use it, passing all current component props
					extraDataForAction = action.getExtraData({
						selectedRows,
						clearFunction,
						dropdownModal,
						...restProps, // Pass all other props like journeyStepId, jwt
					});
				}
				executeAction(actionKey, extraDataForAction);
			}
		};

		// Executes the action callback
		const executeAction = async (actionKey: string, extra?: any) => {
			const action = actionsConfig[actionKey];
			let finalExtraParam: any;

			// Special case for "deleteContacts" to use params.id from Next.js router
			if (actionKey === "deleteContacts") {
				finalExtraParam = params.id;
			} else {
				// For all other actions, use the 'extra' parameter passed to executeAction.
				// This 'extra' will come from dialog input (selectedOption),
				// or from getExtraData/defaultExtraData for non-dialog actions.
				finalExtraParam = extra;
			}

			const result = await action.onAction(selectedRows, finalExtraParam);
			if (!result.success) {
				toast.error(`${action.errorMessage} - ${result.errorMessage || ""}`);
			} else {
				toast.success(action.successMessage || "Success");
			}
			router.refresh();
			clearFunction();
			refreshData?.();
		};

		const closeDialog = () => {
			setIsDialogOpen(false);
			setCurrentActionKey(null);
			setSelectedOption(null);
		};

		// Handle submission from dialog (for actions that require extra input)
		const handleSubmit = async () => {
			if (!currentActionKey) return;
			const action = actionsConfig[currentActionKey];
			if (selectedRows.length === 0 && action.onFilterAction) {
				// Submit with filters and selection (if any)
				const result = await action.onFilterAction(
					filters || {},
					selectedOption,
				);
				if (!result.success) {
					toast.error(`${action.errorMessage} - ${result.errorMessage || ""}`);
				} else {
					toast.success(action.successMessage || "Success");
				}
			} else {
				// Standard mass action
				await executeAction(currentActionKey, selectedOption);
			}
			closeDialog();
		};

		const currentAction = currentActionKey
			? actionsConfig[currentActionKey]
			: null;

		return (
			<Dialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					setIsDialogOpen(open);
					if (!open) {
						setSelectedOption(null);
					}
				}}
			>
				<DropdownMenu modal={dropdownModal}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="relative ml-3 bg-card text-muted-foreground hover:border-accent-foreground/25 hover:bg-accent"
						>
							<span className="block md:hidden">
								<SlidersHorizontal className="h-5 w-5" />
								{selectedRows.length > 0 && (
									<span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
								)}
							</span>
							<span className="hidden md:inline">
								{"Mass Actions"} ({selectedRows.length})
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{Object.keys(actionsConfig).map((actionKey) => {
							const action = actionsConfig[actionKey];
							return (
								<DropdownMenuItem
									key={actionKey}
									disabled={
										selectedRows.length === 0 &&
										!actionsConfig[actionKey].dialogContentWithFilters
									}
									onClick={() => handleActionClick(actionKey)}
								>
									{selectedRows.length === 0 &&
									actionsConfig[actionKey].labelWithFilters
										? action.labelWithFilters
										: action.label}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
				{currentAction?.requiresDialog && currentActionKey && (
					<DialogContent
						className={cn(
							"grid max-h-[98vh] w-auto max-w-[98vw] grid-rows-[auto,1fr,auto] md:max-w-[90vw] lg:max-w-[90vw]",
							selectedRows.length === 0
								? "min-w-[90vw] overflow-scroll p-6"
								: "min-w-[50vw] overflow-visible p-7",
						)}
					>
						{selectedRows.length === 0
							? currentAction.dialogContentWithFilters?.({
									filters,
									selectedOption,
									setSelectedOption,
									setFilters,
									closeDialog: setIsDialogOpen,
									setDialogNeeded,
									onSubmit:
										actionsConfig[currentActionKey]
											.onFilterActionWithoutApprove,
								})
							: currentAction.dialogContent?.({
									selectedOption,
									setSelectedOption,
									selectedRows,
								})}

						{dialogNeeded && (
							<DialogFooter className="justify-between border-t p-4">
								<Button variant="secondary" onClick={closeDialog}>
									Cancel
								</Button>
								<Button
									onClick={handleSubmit}
									disabled={
										!selectedOption &&
										actionsConfig[currentActionKey].selectedOptionNeeded
									}
								>
									{currentAction.dialogSubmitLabel || "Submit"}
								</Button>
							</DialogFooter>
						)}
					</DialogContent>
				)}
			</Dialog>
		);
	};
}

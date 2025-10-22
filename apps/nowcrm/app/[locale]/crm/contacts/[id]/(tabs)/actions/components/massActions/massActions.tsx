// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { massDeleteActions } from "./massDeleteActions";

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: number[]) => {
			return await massDeleteActions(selectedRows);
		},
		successMessage: "Actions deleted",
		errorMessage: "Error during deleting actions",
	},
};

// Create the MassActions component using the generator
const ActionsMassActions = massActionsGenerator(actionsConfig);

export default ActionsMassActions;

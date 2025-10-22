"use client";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteTag } from "./massDeleteTags";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteTag(selectedRows);
		},
		successMessage: "Tags deleted",
		errorMessage: "Error deleting Tags",
	},
};

// Create the MassActions component using the generator
const TagMassActions = massActionsGenerator(actionsConfig);

export default TagMassActions;

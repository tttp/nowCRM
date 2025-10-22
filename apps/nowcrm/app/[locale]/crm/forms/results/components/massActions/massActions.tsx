// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteSurveyItems } from "./massDeleteSurveyItems";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteSurveyItems(selectedRows);
		},
		successMessage: "Survey Item deleted",
		errorMessage: "Error during deleting lists",
	},
};

// Create the MassActions component using the generator
const surveyItemsMassActions = massActionsGenerator(actionsConfig);

export default surveyItemsMassActions;

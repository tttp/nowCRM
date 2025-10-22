// CampaignCategoriesMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteCampaignCategories } from "./massDeleteCampaignCategories";

// Define the actions configuration for campaign categories
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteCampaignCategories(selectedRows);
		},
		successMessage: "Campaign categories deleted",
		errorMessage: "Error deleting campaign categories",
	},
};

// Create the MassActions component using the generator
const CampaignCategoriesMassActions = massActionsGenerator(actionsConfig);

export default CampaignCategoriesMassActions;

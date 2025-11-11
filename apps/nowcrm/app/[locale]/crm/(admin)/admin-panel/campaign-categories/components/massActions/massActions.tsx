// CampaignCategoriesMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteCampaignCategories } from "./massDeleteCampaignCategories";
import { DocumentId } from "@nowcrm/services";
// Define the actions configuration for campaign categories
const actionsConfig: ActionsConfig = {
	deleteCampaignCategories: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteCampaignCategories(selectedRows);
		},
		successMessage: "Campaign categories deleted",
		errorMessage: "Error deleting campaign categories",
	},
};

// Create the MassActions component using the generator
const CampaignCategoriesMassActions = massActionsGenerator(actionsConfig);

export default CampaignCategoriesMassActions;

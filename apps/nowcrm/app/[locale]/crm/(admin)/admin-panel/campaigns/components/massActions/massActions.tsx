// CampaignsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteCampaigns } from "./massDeleteCampaigns";

// Define the actions configuration for campaigns
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteCampaigns(selectedRows);
		},
		successMessage: "Campaigns deleted",
		errorMessage: "Error deleting campaigns",
	},
};

// Create the MassActions component using the generator
const CampaignsMassActions = massActionsGenerator(actionsConfig);

export default CampaignsMassActions;

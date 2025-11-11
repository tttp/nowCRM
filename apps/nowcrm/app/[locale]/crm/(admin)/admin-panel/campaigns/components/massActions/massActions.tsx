// CampaignsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteCampaigns } from "./massDeleteCampaigns";
import { DocumentId } from "@nowcrm/services";

// Define the actions configuration for campaigns
const actionsConfig: ActionsConfig = {
	deleteCampaigns: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteCampaigns(selectedRows);
		},
		successMessage: "Campaigns deleted",
		errorMessage: "Error deleting campaigns",
	},
};

// Create the MassActions component using the generator
const CampaignsMassActions = massActionsGenerator(actionsConfig);

export default CampaignsMassActions;

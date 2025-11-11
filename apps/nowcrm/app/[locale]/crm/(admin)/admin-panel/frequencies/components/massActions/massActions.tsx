"use client";
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteFrequencies } from "./massDeleteFrequencies";
import { DocumentId } from "@nowcrm/services";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteFrequencies(selectedRows);
		},
		successMessage: "Frequencies deleted",
		errorMessage: "Error deleting frequencies",
	},
};

// Create the MassActions component using the generator
const FrequencyMassActions = massActionsGenerator(actionsConfig);

export default FrequencyMassActions;

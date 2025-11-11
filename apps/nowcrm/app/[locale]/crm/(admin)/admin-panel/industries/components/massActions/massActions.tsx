// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteIndustries } from "./massDeleteIndustries";
import { DocumentId } from "@nowcrm/services";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteIndustries(selectedRows);
		},
		successMessage: "Industries deleted",
		errorMessage: "Error deleting industries",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;

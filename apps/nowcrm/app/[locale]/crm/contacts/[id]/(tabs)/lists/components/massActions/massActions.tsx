// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassRemoveLists } from "./massRemoveLists";

// Get your translations/messages

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Remove", // e.g., "Delete"
		onAction: async (selectedRows: number[], contactId: number) => {
			return await MassRemoveLists(selectedRows, contactId);
		},
		successMessage: "Lists disconnected",
		errorMessage: "Error during disconecting lists",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;

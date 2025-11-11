// ContactTitlesMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteContactTitles } from "./massDeleteContactTitles";
import { DocumentId } from "@nowcrm/services";

// Define the actions configuration for contact titles
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteContactTitles(selectedRows);
		},
		successMessage: "Contact titles deleted",
		errorMessage: "Error deleting contact titles",
	},
};

// Create the MassActions component using the generator
const ContactTitlesMassActions = massActionsGenerator(actionsConfig);

export default ContactTitlesMassActions;

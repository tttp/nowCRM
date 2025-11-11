// ContactSalutationsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteContactSalutations } from "./massDeleteContactSalutations";
import { DocumentId } from "@nowcrm/services";

// Define the actions configuration for contact salutations
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteContactSalutations(selectedRows);
		},
		successMessage: "Contact salutations deleted",
		errorMessage: "Error deleting contact salutations",
	},
};

// Create the MassActions component using the generator
const ContactSalutationsMassActions = massActionsGenerator(actionsConfig);

export default ContactSalutationsMassActions;

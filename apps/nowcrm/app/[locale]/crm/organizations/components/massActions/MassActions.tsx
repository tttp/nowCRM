// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import AssignToListDialog from "./dialogs/addToList";
import { MassDeleteOrganizations } from "./MassDeleteOrganizations";
import { MassAddToList } from "./massAddToList";
import { DocumentId } from "@nowcrm/services";

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	assignToList: {
		label: "Add to list", // e.g., "Assign to List"
		requiresDialog: true,
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<AssignToListDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		),
		dialogSubmitLabel: "Add to list",
		onAction: async (selectedRows: DocumentId[], selectedOption: any) => {
			return await MassAddToList(selectedRows, selectedOption.value);
		},
		successMessage: "Organizations added to list",
		errorMessage: "Error during adding organizations to list",
	},
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteOrganizations(selectedRows);
		},
		successMessage: "Organizations deleted",
		errorMessage: "Error during deliting organizations",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;

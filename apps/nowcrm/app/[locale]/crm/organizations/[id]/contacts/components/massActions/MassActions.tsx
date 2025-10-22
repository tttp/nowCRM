// ContactsMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import AssignToListDialog from "./dialogs/addToList";
import { MassDisconnectContacts } from "./MassDisconnectContacts";
import { MassAddToList } from "./massAddToList";

// Get your translations/messages

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
		onAction: async (selectedRows: number[], selectedOption: any) => {
			return await MassAddToList(selectedRows, selectedOption.value);
		},
		successMessage: "Contact added to list",
		errorMessage: "Error durinf adding contact to list",
	},
	deleteContacts: {
		label: "Remove", // e.g., "Delete"
		onAction: async (selectedRows: number[], listId: string) => {
			return await MassDisconnectContacts(
				Number.parseInt(listId),
				selectedRows,
			);
		},
		successMessage: "Contacts removed from organization",
		errorMessage: "Error during removing contacts",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;

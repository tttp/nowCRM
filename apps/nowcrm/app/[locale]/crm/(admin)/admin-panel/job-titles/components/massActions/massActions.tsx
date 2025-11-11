// JobTitlesMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteJobTitles } from "./massDeleteJobTitles";
import { DocumentId } from "@nowcrm/services";

// Define the actions configuration for job titles
const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteJobTitles(selectedRows);
		},
		successMessage: "Job titles deleted",
		errorMessage: "Error deleting job titles",
	},
};

// Create the MassActions component using the generator
const JobTitlesMassActions = massActionsGenerator(actionsConfig);

export default JobTitlesMassActions;

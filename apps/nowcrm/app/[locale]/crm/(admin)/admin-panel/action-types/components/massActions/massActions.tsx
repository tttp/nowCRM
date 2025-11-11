"use client";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteActionTypes } from "./massDeleteActionType";
import { DocumentId } from "@nowcrm/services";
const actionsConfig: ActionsConfig = {
	deleteActionTypes: {
		label: "Delete",
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteActionTypes(selectedRows);
		},
		successMessage: "Action Type deleted",
		errorMessage: "Error deleting action type",
	},
};

// Create the MassActions component using the generator
const OrganizationTypeMassActions = massActionsGenerator(actionsConfig);

export default OrganizationTypeMassActions;

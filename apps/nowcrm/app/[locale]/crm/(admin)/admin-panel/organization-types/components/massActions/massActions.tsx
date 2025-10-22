"use client";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteOrganizationTypes } from "./massDeleteOrganizationType";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteOrganizationTypes(selectedRows);
		},
		successMessage: "Organization Type deleted",
		errorMessage: "Error deleting organization type",
	},
};

// Create the MassActions component using the generator
const OrganizationTypeMassActions = massActionsGenerator(actionsConfig);

export default OrganizationTypeMassActions;

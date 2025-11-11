"use client";
// IdentitityMassActions.tsx
import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteIdentities } from "./massDeleteIdentities";
import { DocumentId } from "@nowcrm/services";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteIdentities(selectedRows);
		},
		successMessage: "Identities deleted",
		errorMessage: "Error deleting identities",
	},
};

// Create the MassActions component using the generator
const IdentitityMassActions = massActionsGenerator(actionsConfig);

export default IdentitityMassActions;

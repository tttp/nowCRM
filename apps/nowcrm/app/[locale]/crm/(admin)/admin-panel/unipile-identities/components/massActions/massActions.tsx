// IdentitityMassActions.tsx
"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import { MassDeleteUnipileIdentities } from "./MassDeleteUnipileIdentities";
import { DocumentId } from "@nowcrm/services";

const actionsConfig: ActionsConfig = {
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		onAction: async (selectedRows: DocumentId[]) => {
			return await MassDeleteUnipileIdentities(selectedRows);
		},
		successMessage: "Identities deleted",
		errorMessage: "Error during deleting identities",
	},
};

// Create the MassActions component using the generator
const IdentitityMassActions = massActionsGenerator(actionsConfig);

export default IdentitityMassActions;

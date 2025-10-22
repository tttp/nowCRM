"use client";

import {
	type ActionsConfig,
	massActionsGenerator,
} from "@/components/generativeComponents/MassActionsGenerator";
import {
	addContactsToJourneyByFilters,
	addContactsToListByFilters,
	addContactsToOrganizationByFilters,
	anonymizeContactsByFilters,
	deleteContactsByFilters,
	exportContactsByFilters,
	sendCompositionByFilters,
	UpdateSubscriptionContactsByFilters,
	updateContactsByFilters,
} from "@/lib/actions/filters/massActions";
import AddToJourneyDialog from "./addToJourney/addToJourney";
import AddToJourneyWithFiltersDialog from "./addToJourney/addToJourneyWithFilters";
import { MassAddToJourney } from "./addToJourney/MassAddToJourney";
import AssignToListDialog from "./addToList/addToList";
import AssignToListWithFiltersDialog from "./addToList/addToListWithFilters";
import { MassAddToList } from "./addToList/massAddToList";
import AddToOrganisationDialog from "./addToOrganisation/addToOrganization";
import AddToOrganizationWithFiltersDialog from "./addToOrganisation/addToOrganizationWithFilters";
import { MassAddToOrganization } from "./addToOrganisation/MassAddToOrganization";
import AnonymizeContactsDialog from "./anonymize/anonymizeContactsDialog";
import AnonymizeWithFiltersDialog from "./anonymize/anonymizeWithFilters";
import { MassAnonymizeContacts } from "./anonymize/MassAnonymizeContacts";
import DeleteContactsDialog from "./delete/DeleteContactsDialog";
import DeleteWithFiltersDialog from "./delete/DeleteWithFilters";
import { MassDeleteContacts } from "./delete/MassDeleteContacts";
import ExportContactsDialog from "./export/ExportContactsDialog";
import ExportWithFiltersDialog from "./export/exportWithFilters";
import { MassExportContacts } from "./export/MassExportContacts";
import { MassSendComposition } from "./sendComposition/MassSendComposition";
import SendCompositionDialog from "./sendComposition/sendComposition";
import SendCompositionWithFiltersDialog from "./sendComposition/sendCompositionWithFilters";
import { MassUpdateContactField } from "./update/MassUpdateContacts";
import UpdateContactFieldDialog from "./update/Update";
import UpdateContactFieldWithFiltersDialog from "./update/updateWithFilters";
import { MassUpdateSubscription } from "./updateSubscription/MassUpdateSubscription";
import UpdateSubscriptionDialog from "./updateSubscription/updateSubscription";
import UpdateSubscriptionWithFiltersDialog from "./updateSubscription/updateSubscriptionWithFilters";

// Define the actions configuration for contacts
const actionsConfig: ActionsConfig = {
	assignToList: {
		requiresDialog: true,
		selectedOptionNeeded: true,
		label: "Add to list", // e.g., "Assign to List"
		dialogContent: ({ selectedOption, setSelectedOption, selectedRows }) => (
			<AssignToListDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				selectedRows={selectedRows?.length}
			/>
		),
		onAction: async (selectedRows: number[], selectedOption: any) => {
			return await MassAddToList(selectedRows, selectedOption.value);
		},

		labelWithFilters: "Add to list with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => (
			<AssignToListWithFiltersDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				closeDialog={closeDialog}
				setFilters={setFilters}
				setDialogNeeded={setDialogNeeded}
			/>
		),
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: { value: number },
		) => {
			return await addContactsToListByFilters(filters, selectedOption.value);
		},
		dialogSubmitLabel: "Add to list",
		successMessage:
			"The process of adding contacts to the list has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during adding contacts to list",
	},
	deleteContacts: {
		label: "Delete", // e.g., "Delete"
		requiresDialog: true,
		dialogContent: ({ selectedRows }) => (
			<DeleteContactsDialog selectedRows={selectedRows} />
		),
		onAction: async (selectedRows: number[]) => {
			return await MassDeleteContacts(selectedRows);
		},

		labelWithFilters: "Delete with filters",
		dialogContentWithFilters: ({
			filters,
			closeDialog,
			setFilters,
			onSubmit,
		}) => (
			<DeleteWithFiltersDialog
				filters={filters}
				closeDialog={closeDialog}
				setFilters={setFilters}
				onSubmit={onSubmit}
			/>
		),
		onFilterActionWithoutApprove: async (filters: Record<string, any>) => {
			return await deleteContactsByFilters({
				entity: "contacts",
				searchMask: filters,
				mass_action: "delete",
			});
		},
		dialogSubmitLabel: "Delete",
		successMessage:
			"The deletion process has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during deleting contacts",
	},
	anonymize: {
		label: "Anonymize",
		requiresDialog: true,
		dialogContent: ({ selectedRows }) => (
			<AnonymizeContactsDialog selectedRows={selectedRows} />
		),
		onAction: async (selectedRows: number[]) => {
			return await MassAnonymizeContacts(selectedRows);
		},
		labelWithFilters: "Anonymize with filters",
		dialogContentWithFilters: ({
			filters,
			closeDialog,
			setFilters,
			onSubmit,
		}) => (
			<AnonymizeWithFiltersDialog
				filters={filters}
				closeDialog={closeDialog}
				setFilters={setFilters}
				onSubmit={onSubmit}
			/>
		),
		onFilterActionWithoutApprove: async (filters: Record<string, any>) => {
			return await anonymizeContactsByFilters({
				entity: "contacts",
				searchMask: filters,
				mass_action: "anonymize",
			});
		},
		dialogSubmitLabel: "Anonymize",
		successMessage:
			"The anonymization process has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during anonymizing contacts",
	},
	export: {
		label: "Export",
		requiresDialog: true,
		dialogContent: ({ selectedRows }) => (
			<ExportContactsDialog selectedRows={selectedRows} />
		),
		onAction: async (selectedRows: number[]) => {
			const res = await MassExportContacts(selectedRows);
			if (!res.success || !res.data) throw new Error("Export failed");

			const a = document.createElement("a");
			a.href = `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(res.data)}`;
			a.download = `contacts_${new Date().toISOString()}.csv`;
			a.click();

			return { data: null, status: 200, success: true };
		},

		labelWithFilters: "Export with filters",
		dialogContentWithFilters: ({
			filters,
			closeDialog,
			setFilters,
			onSubmit,
		}) => (
			<ExportWithFiltersDialog
				filters={filters}
				closeDialog={closeDialog}
				setFilters={setFilters}
				onSubmit={onSubmit}
			/>
		),
		onFilterActionWithoutApprove: async (filters: Record<string, any>) => {
			const res = await exportContactsByFilters({
				entity: "contacts",
				searchMask: filters,
				mass_action: "export",
			});

			if (!res.success || !res.data)
				throw new Error("Export with filters failed");

			return { data: null, status: 200, success: true };
		},

		dialogSubmitLabel: "Export",
		successMessage:
			"The export process has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during exporting contacts",
	},
	update: {
		requiresDialog: true,
		selectedOptionNeeded: true,
		label: "Update",
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<UpdateContactFieldDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		),
		onAction: async (selectedRows: number[], selectedOption: any) => {
			return await MassUpdateContactField(
				selectedRows,
				selectedOption.field,
				selectedOption.value,
			);
		},
		labelWithFilters: "Update with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => (
			<UpdateContactFieldWithFiltersDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				closeDialog={closeDialog}
				setFilters={setFilters}
				setDialogNeeded={setDialogNeeded}
			/>
		),
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: { field: string; value: string },
		) => {
			return await updateContactsByFilters(filters, selectedOption);
		},
		dialogSubmitLabel: "Update",
		successMessage:
			"The update process has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error updating contact fields",
	},
	updateSubscription: {
		requiresDialog: true,
		selectedOptionNeeded: true,
		label: "Update subscription", // e.g., "Assign to List"
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<UpdateSubscriptionDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		),
		onAction: async (
			selectedRows: number[],
			selectedOption: { value: number; isSubscribed?: boolean },
		) => {
			const isSubscribe = !!selectedOption.isSubscribed;
			return await MassUpdateSubscription(
				selectedRows,
				selectedOption.value,
				isSubscribe,
			);
		},

		labelWithFilters: "Update subscription with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => (
			<UpdateSubscriptionWithFiltersDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				closeDialog={closeDialog}
				setFilters={setFilters}
				setDialogNeeded={setDialogNeeded}
			/>
		),
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: { value: number; isSubscribed?: boolean },
		) => {
			const isSubscribe = !!selectedOption.isSubscribed;
			return await UpdateSubscriptionContactsByFilters(
				filters,
				selectedOption.value,
				isSubscribe,
			);
		},
		dialogSubmitLabel: "Update subscription",
		successMessage:
			"The process of updating subscriptions to contacts has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during updating contacts",
	},
	send: {
		requiresDialog: true,
		selectedOptionNeeded: true,
		label: "Send composition",
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<SendCompositionDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				defaultThrottle={null}
			/>
		),
		onAction: async (selectedRows: number[], selectedOption: any) => {
			const compositionId = selectedOption.composition_id;
			const channels = selectedOption.channels;
			const subject = selectedOption.subject;
			const from = selectedOption.from;
			const interval = selectedOption.interval;
			const result = await MassSendComposition(
				selectedRows,
				compositionId,
				channels,
				subject,
				from,
				interval,
			);
			return result;
		},

		labelWithFilters: "Send composition with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => {
			return (
				<SendCompositionWithFiltersDialog
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
					closeDialog={closeDialog}
					setFilters={setFilters}
					setDialogNeeded={setDialogNeeded}
					defaultThrottle={null}
				/>
			);
		},
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: {
				composition_id: number;
				channels: string[];
				subject: string;
				from: string;
				interval: number;
			},
		) => {
			const compositionId = selectedOption.composition_id;
			const channels = selectedOption.channels;
			const subject = selectedOption.subject;
			const from = selectedOption.from;
			const interval = selectedOption.interval;

			return await sendCompositionByFilters(
				filters,
				compositionId,
				channels,
				subject,
				from,
				interval,
			);
		},
		dialogSubmitLabel: "Send composition",
		successMessage:
			"The sending process has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during sending composition",
	},
	addToJourney: {
		label: "Add to journey step",
		requiresDialog: true,
		selectedOptionNeeded: true,
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<AddToJourneyDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		),
		onAction: async (selectedRows: number[], selectedOption: any) => {
			return await MassAddToJourney(selectedRows, selectedOption.value);
		},
		labelWithFilters: "Add to journey step with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => (
			<AddToJourneyWithFiltersDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				closeDialog={closeDialog}
				setFilters={setFilters}
				setDialogNeeded={setDialogNeeded}
			/>
		),
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: { value: number },
		) => {
			return await addContactsToJourneyByFilters(filters, selectedOption.value);
		},
		dialogSubmitLabel: "Add to journey step",
		successMessage:
			"The process of adding contacts to the journey step has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during adding contacts to journey step",
	},
	addToOrganization: {
		requiresDialog: true,
		selectedOptionNeeded: true,
		label: "Add to organization", // e.g., "Assign to List"
		dialogContent: ({ selectedOption, setSelectedOption }) => (
			<AddToOrganisationDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		),
		onAction: async (selectedRows: number[], selectedOption: any) => {
			return await MassAddToOrganization(selectedRows, selectedOption.value);
		},

		labelWithFilters: "Add to organization with filters",
		dialogContentWithFilters: ({
			selectedOption,
			setSelectedOption,
			closeDialog,
			setFilters,
			setDialogNeeded,
		}) => (
			<AddToOrganizationWithFiltersDialog
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				closeDialog={closeDialog}
				setFilters={setFilters}
				setDialogNeeded={setDialogNeeded}
			/>
		),
		onFilterAction: async (
			filters: Record<string, any>,
			selectedOption: { value: number },
		) => {
			return await addContactsToOrganizationByFilters(
				filters,
				selectedOption.value,
			);
		},
		dialogSubmitLabel: "Add to organization",
		successMessage:
			"The process of adding contacts to the organization has started. Depending on the number of selected contacts, it may take up to 10–15 minutes.",
		errorMessage: "Error during adding contacts to organization",
	},
};

// Create the MassActions component using the generator
const ContactsMassActions = massActionsGenerator(actionsConfig);

export default ContactsMassActions;

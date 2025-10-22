export type CompositionStatus = {
	label: string;
	value: string;
};

export type CompositionStatusKeys = "Finished" | "Pending" | "Errored";

export const compositionStatuses: CompositionStatus[] = [
	{ label: "Finished", value: "Finished" },
	{ label: "Pending", value: "Pending" },
	{ label: "Errored", value: "Errored" },
];

export type CompositionItemsStatusKeys =
	| "Published"
	| "Not published"
	| "Scheduled"
	| "None";

export const compositionItemsStatuses: CompositionStatus[] = [
	{ label: "Published", value: "Published" },
	{ label: "Not published", value: "Not published" },
	{ label: "Scheduled", value: "Scheduled" },
	{ label: "None", value: "None" },
];

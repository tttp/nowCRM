export type CompositionModel = {
	label: string;
	value: string;
};

export type CompositionModelKeys = "gpt-4o-mini" | "claude";

export const compositionModels: CompositionModel[] = [
	{ label: "gpt-4o-mini", value: "gpt-4o-mini" },
	{ label: "claude", value: "claude" },
];

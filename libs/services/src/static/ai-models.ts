export type aiModel = {
	label: string;
	value: string;
};

export type aiModelKeys = "gpt-4o-mini" | "claude";

export const aiModels: aiModel[] = [
	{ label: "gpt-4o-mini", value: "gpt-4o-mini" },
	{ label: "claude", value: "claude" },
];

export type Language = {
	label: string;
	value: string;
};

export type LanguageKeys = "en" | "de" | "it" | "fr";
export const languages: Language[] = [
	{ label: "English", value: "en" },
	{ label: "German", value: "de" },
	{ label: "Francais", value: "fr" },
	{ label: "Italiano", value: "it" },
];

export function getLanguageValue(label: string | undefined): LanguageKeys {
	if (!label) return "en";
	const language = languages.find((lang) => lang.label === label);
	return language ? (language.value as LanguageKeys) : "en";
}

export function getLanguageLabel(value: string): string | undefined {
	const language = languages.find((lang) => lang.value === value);
	return language ? language.label : "English";
}

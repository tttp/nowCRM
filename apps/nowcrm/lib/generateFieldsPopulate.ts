const IGNORE = new Set(["select", "actions", "delete"]);

// relation names in your Contact model
const RELATIONS = new Set([
	"subscriptions",
	"organization",
	"department",
	"title",
	"salutation",
	"job_title",
	"industry",
	"contact_types",
	"lists",
	"keywords",
	"contact_interests",
	"journeys",
	"journey_steps",
	"tags",
	"survey_items",
]);

export function fieldsFromVisible(
	visibleIds: string[],
	alwaysInclude: string[] = ["id"],
): string[] {
	const s = new Set<string>(alwaysInclude.filter(Boolean));

	for (const raw of visibleIds) {
		const id = (raw || "").trim();
		if (!id || IGNORE.has(id)) continue;
		// ignore dotted paths -> handled by populate
		if (id.includes(".")) continue;
		// ignore relations in fields
		if (RELATIONS.has(id)) continue;
		s.add(id);
	}
	return Array.from(s);
}

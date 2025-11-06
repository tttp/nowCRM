import qs from "qs";

const FIELD_OVERRIDES: Record<string, string[]> = {
	subscriptions: ["channel", "name"],
	contact_interests: ["name"],
	contact_types: ["name"],
	ranks: ["name"],
	department: ["name"],
	job_title: ["name"],
	media_types: ["name"],
	organization: ["name"],
	industry: ["name"],
	lists: ["name"],
	sources: ["name"],
	journeys: ["name"],
	journey_steps: ["name"],
	surveys: ["name"],
	tags: ["name"],
	salutation: ["name"],
	title: ["name"],
};

const FIELD_ALIASES: Record<string, string> = {
	organization_name: "organization.name",
	organization_createdAt: "organization.createdAt",
	organization_updatedAt: "organization.updatedAt",
	survey_items_question: "survey_items.question",
	survey_items_answer: "survey_items.answer",
	event_composition: "events.composition.category",
	event_channel: "events.channel.name",
	event_title: "events.title",
	event_action: "events.action",
	event_status: "events.status",
	donation_subscriptions_from: "donation_subscriptions.createdAt",
	donation_subscriptions_amount: "donation_subscriptions.amount",
	donation_subscriptions_interval: "donation_subscriptions.interval",
	donation_transactions_from: "donation_transactions.createdAt",
	donation_transactions_amount: "donation_transactions.amount",
	donation_transactions_campaign_name: "donation_transactions.campaign_name",
	donation_transactions_status: "donation_transactions.status",
	action_normalized_type: "actions.action_normalized_type.name",
	action_source: "actions.source",
	action_value: "actions.value",
	action_external_id: "actions.external_id",
	action_partnership: "actions.partnership",
};

/* ----------------- tiny helpers ----------------- */

function setNested(target: any, path: string, value: any) {
	const keys = path.split(".");
	let cur = target;
	keys.forEach((k, i) => {
		if (i === keys.length - 1) {
			if (typeof cur[k] === "object" && typeof value === "object") {
				cur[k] = { ...cur[k], ...value };
			} else {
				cur[k] = value;
			}
		} else {
			if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
			cur = cur[k];
		}
	});
}

function buildNestedObject(path: string[], value: any): any {
	if (!path.length) return value;
	const [h, ...r] = path;
	return { [h]: buildNestedObject(r, value) };
}

function deepMerge(target: any, source: any) {
	for (const k of Object.keys(source)) {
		const sv = source[k];
		if (
			sv &&
			typeof sv === "object" &&
			!Array.isArray(sv) &&
			!(sv instanceof Date)
		) {
			if (!target[k] || typeof target[k] !== "object") target[k] = {};
			deepMerge(target[k], sv);
		} else {
			target[k] = sv;
		}
	}
}

const isRelObject = (v: any) => v && typeof v === "object" && "value" in v;
const isRelArray = (v: any) =>
	Array.isArray(v) &&
	v.length > 0 &&
	v.every((x) => x && typeof x === "object" && "value" in x);

/* Build a single Strapi condition object for a field */
function buildFieldCondition(key: string, rawValue: any, operator?: string) {
	let op = operator || "$eq";
	const cond: any = {};

	// handle null / notNull operators that ignore value
	if (op === "$null" || op === "$notNull") {
		const aliased = FIELD_ALIASES[key] || key;
		setNested(cond, aliased, { [op]: true });
		return cond;
	}

	// relation single
	if (isRelObject(rawValue)) {
		const v = rawValue.label;
		const overridePath = FIELD_OVERRIDES[key];
		const aliased = FIELD_ALIASES[key] || key;

		if (overridePath) {
			// subscriptions.channel.name -> { subscriptions: { channel: { name: { $eq: v } } } }
			cond[key] = buildNestedObject(overridePath, { [op]: v });
		} else {
			setNested(cond, aliased, { [op]: v });
		}
		return cond;
	}

	// relation multi
	if (isRelArray(rawValue)) {
		const values = rawValue.map((x: any) => x.label);
		op = op === "$notIn" ? "$notIn" : "$in";
		const overridePath = FIELD_OVERRIDES[key];
		if (overridePath) {
			cond[key] = buildNestedObject(overridePath, { [op]: values });
		} else {
			// default to id in list
			cond[key] = { id: { [op]: values } };
		}
		return cond;
	}

	// CSV string → IN/NOT IN
	if (
		typeof rawValue === "string" &&
		rawValue.includes(",") &&
		!["country", "canton"].includes(key)
	) {
		const values = rawValue
			.split(",")
			.map((v) => v.trim())
			.filter(Boolean);
		op = op === "$notIn" ? "$notIn" : "$in";
		const aliased = FIELD_ALIASES[key] || key;
		setNested(cond, aliased, { [op]: values });
		return cond;
	}

	// plain scalar
	const aliased = FIELD_ALIASES[key] || key;
	setNested(cond, aliased, { [op]: rawValue });
	return cond;
}

/* Build one group from its filters object */
function buildGroup(filtersObj: Record<string, any>, groupLogic: "AND" | "OR") {
	const conditions: any[] = [];

	for (const [k, v] of Object.entries(filtersObj || {})) {
		if (k.endsWith("_operator")) continue;
		const op = filtersObj[`${k}_operator`];

		// skip blanks unless operator is null/notNull
		const treatAsPresent =
			op === "$null" ||
			op === "$notNull" ||
			(v !== "" && v != null && !(Array.isArray(v) && v.length === 0));
		if (!treatAsPresent) continue;

		const fieldCond = buildFieldCondition(k, v, op);
		if (Object.keys(fieldCond).length) conditions.push(fieldCond);
	}

	if (conditions.length === 0) return null;
	if (conditions.length === 1) return conditions[0];

	return groupLogic === "OR" ? { $or: conditions } : andMerge(conditions);
}

// merge list of objects with AND semantics
function andMerge(objs: any[]) {
	const acc: any = {};
	for (const o of objs) deepMerge(acc, o);
	return acc;
}

/* ----------------- main API ----------------- */

export function transformFilters<T extends Record<string, any>>(filters: T) {
	if (Array.isArray((filters as any).groups)) {
		// grouped path (contacts)
		const groups = (filters as any).groups as Array<{
			logic: "AND" | "OR";
			filters?: Record<string, any>;
		}>;
		const topLogic: "AND" | "OR" = (filters as any).groupLogic || "AND";

		const built = groups
			.map((g) => buildGroup(g.filters || {}, g.logic || "AND"))
			.filter(Boolean) as any[];

		if (built.length === 0) return {};
		if (built.length === 1) return built[0];
		return topLogic === "OR" ? { $or: built } : { $and: built };
	}

	// flat shape (orgs)
	const flat: Record<string, any> = filters as any;
	const conds: any[] = [];
	for (const [k, v] of Object.entries(flat)) {
		if (k.endsWith("_operator") || k.startsWith("$")) continue;
		if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
		const op = flat[`${k}_operator`];
		conds.push(buildFieldCondition(k, v, op));
	}
	if (conds.length === 0) return {};
	return andMerge(conds);
}

export function parseFormIntoUrlFilters<T extends Record<string, any>>(
	filters: T,
): string {
	const strapiFilters = transformFilters(filters as any);
	return qs.stringify({ filters: strapiFilters }, { encodeValuesOnly: true });
}

// delete this file --- IGNORE ---
export function parseQueryToFilterValues<T extends Record<string, any>>(
	searchParams: URLSearchParams,
): T {
	const parsed = qs.parse(searchParams.toString(), {
		ignoreQueryPrefix: true,
	}) as any;
	const rawFilters = (parsed.filters || {}) as Record<string, any>;
	const result: Record<string, any> = {};

	const flatten = (obj: any, prefix = "") => {
		for (const key of Object.keys(obj)) {
			const value = obj[key];
			const fullKey = prefix ? `${prefix}.${key}` : key;

			if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value) &&
				Object.keys(value).every((k) => k.startsWith("$"))
			) {
				const operator = Object.keys(value)[0];
				const val = value[operator];
				result[fullKey] = Array.isArray(val) ? val.join(",") : val;
				result[`${fullKey}_operator`] = operator;
			} else if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value)
			) {
				flatten(value, fullKey);
			} else {
				result[fullKey] = value;
			}
		}
	};
	flatten(rawFilters);
	return result as T;
}

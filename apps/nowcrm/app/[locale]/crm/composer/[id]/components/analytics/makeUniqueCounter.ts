export type EventRow = {
	action: string;
	contact?: { id: number } | null;
	createdAt?: string | Date;
};

type Mode = "unique" | "raw";

export function makeCounter(rows: EventRow[], mode: Mode = "unique") {
	const by: Record<string, Set<string>> = {
		publish: new Set(),
		unpublish: new Set(),
		send: new Set(),
		delivery: new Set(),
		open: new Set(),
		click: new Set(),
		bounce: new Set(),
		"permanent bounce": new Set(),
		"transient bounce": new Set(),
		"undetermined bounce": new Set(),
		unsubscribe: new Set(),
	};

	const foundCount: Record<string, number> = {
		publish: 0,
		unpublish: 0,
		send: 0,
		delivery: 0,
		open: 0,
		click: 0,
		"permanent bounce": 0,
		"transient bounce": 0,
		"undetermined bounce": 0,
		bounce: 0,
		unsubscribe: 0,
	};

	for (const r of rows) {
		const a = r.action?.toLowerCase?.();
		if (!a) continue;

		foundCount[a] = (foundCount[a] ?? 0) + 1;

		if (mode === "unique" && a !== "publish" && a !== "send") {
			const contactId = r.contact?.id ? String(r.contact.id) : null;
			if (contactId) by[a]?.add(contactId);
		}
	}

	const count = (types: string | string[] | undefined) => {
		if (!types) return 0;

		const arr = Array.isArray(types) ? types : [types];
		const clean = arr.filter((t): t is string => typeof t === "string");

		if (mode === "raw") {
			return clean.reduce(
				(sum, t) => sum + (foundCount[t.toLowerCase()] ?? 0),
				0,
			);
		}

		const union = new Set<string>();
		for (const t of clean) {
			const norm = t.toLowerCase();
			if (norm === "publish" || norm === "send") {
				for (let i = 0; i < (foundCount[norm] ?? 0); i++) {
					union.add(`${norm}#${i}`);
				}
			} else {
				by[norm]?.forEach((k) => union.add(k));
			}
		}
		return union.size;
	};

	const pct = (num: number, den: number) =>
		den ? Math.min(100, +((num * 100) / den).toFixed(1)) : 0;

	return { count, pct, by, foundCount };
}

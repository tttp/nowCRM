import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Option } from "@/components/autoComplete/autoComplete";
import type { CalendarEventType } from "@/components/event-calendar/types";
import type { ScheduledComposition } from "@/lib/types/new_type/sceduled_composition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toNames = (items?: Array<{ name?: string | null }>) =>
	(items ?? [])
		.map((i) => i?.name)
		.filter(Boolean)
		.join(", ") || "-";

function toSelectOption(
	relation: any,
): { label: string; value: string } | undefined {
	if (!relation) return undefined;

	if (typeof relation === "object" && "id" in relation && "name" in relation) {
		return { label: String(relation.name), value: String(relation.id) };
	}

	if (Array.isArray(relation) && relation.length > 0) {
		const first = relation[0];
		if (typeof first === "object" && "id" in first && "name" in first) {
			return { label: String(first.name), value: String(first.id) };
		}
	}

	if (relation.connect && Array.isArray(relation.connect)) {
		return { label: "", value: String(relation.connect[0]) };
	}

	if (typeof relation === "number" || typeof relation === "string") {
		return { label: "", value: String(relation) };
	}

	return undefined;
}

export function fromCalendarEventToForm(event: Omit<CalendarEventType, "id">) {
	return {
		name: event.name,
		description: event.description ?? "",
		color: event.color ?? "#999999",
		publish_date: event.publish_date,
		publishedAt: new Date(),
		status:
			event.status &&
			["scheduled", "processing", "published"].includes(event.status)
				? event.status
				: "scheduled",
		channel: event.channel
			? { connect: [Number(event.channel.value)] }
			: undefined,
		composition: event.composition
			? { connect: [Number(event.composition.value)] }
			: undefined,
		send_to: event.send_to
			? {
					type: event.send_to.type as "contact" | "list" | "organization",
					send_data: event.send_to.send_data as Option,
					identity: event.send_to.identity as Option,
				}
			: {
					type: "contact" as "contact" | "list" | "organization",
					send_data: undefined,
					identity: undefined,
				},
	};
}

export function mapToCalendarEvents(
	data: ScheduledComposition[],
): CalendarEventType[] {
	return data.map((item) => ({
		id: String(item.id),
		name: item.name,
		status: item.status ?? "scheduled",
		description: item.description ?? "",
		color: item.color ?? "#999999",
		publish_date: new Date(item.publish_date),
		channel: toSelectOption(item.channel),
		composition: toSelectOption(item.composition),
		send_to: item.send_to
			? {
					type: item.send_to.type as "contact" | "list" | "organization",
					send_data: item.send_to.send_data as Option,
					identity: item.send_to.identity as Option,
				}
			: {
					type: "contact" as "contact" | "list" | "organization",
					send_data: undefined,
					identity: undefined,
				},
	}));
}

export function getContactIdByEventId(
	eventId: number,
	events: any[],
): number | null {
	const event = events.find((e) => e.id === eventId);
	return event?.contact?.id ?? null;
}

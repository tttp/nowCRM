export function getJourneysAdminUrl(url: string): string {
	const parsed = new URL(url);
	const host = parsed.hostname;

	if (parsed.hostname === "localhost") {
		return "http://localhost:3010/admin/queues";
	}
	const newHost = host.replace(/^crm/, "journeys");
	return `https://${newHost}/admin/queues`;
}

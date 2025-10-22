export function isValidTimeZone(tz?: string): tz is string {
	if (!tz) return false;
	try {
		// Will throw for invalid IANA names
		new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(0);
		return true;
	} catch {
		return false;
	}
}

export function getInitials(name: string): string {
	if (!name) return "N/A";
	const matches = name.match(/\b\w/g) || [];
	const initials = matches.map((char) => char.toUpperCase());
	return (initials.shift() || "") + (initials.pop() || "");
}

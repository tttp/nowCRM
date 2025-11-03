export function formatDateStrapi(dateInput: Date | string): string {
	if (!dateInput) return "N/A";
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const yy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${dd}/${mm}/${yy}`;
}

export function formatDateTimeStrapi(dateInput: Date | string): string {
	if (!dateInput) return "N/A";
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const yy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const hh = String(date.getHours()).padStart(2, "0");
	const min = String(date.getMinutes()).padStart(2, "0");
	const ss = String(date.getSeconds()).padStart(2, "0");
	return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}

export function timeFromNow(dateInput: Date | string): string {
	if (!dateInput) return "no tasks";

	const inputDate =
		typeof dateInput === "string" ? new Date(dateInput) : dateInput;

	const now = new Date();

	const diffTime = now.getTime() - inputDate.getTime();

	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return "Today";
	} else if (diffDays === 1) {
		return "Yesterday";
	} else if (diffDays > 1) {
		return `${diffDays} days ago`;
	} else if (diffDays === -1) {
		return "Tomorrow";
	} else {
		return `in ${Math.abs(diffDays)} days`;
	}
}

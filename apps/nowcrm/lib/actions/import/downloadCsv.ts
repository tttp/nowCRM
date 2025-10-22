import { saveAs } from "file-saver";
import Papa from "papaparse";

export function downloadCsv(data: any[], filename: string) {
	if (!data || data.length === 0) {
		console.warn("No data to export");
		return;
	}

	const csv = Papa.unparse(data);
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	saveAs(blob, filename);
}

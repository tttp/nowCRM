"use server";

import { dalService } from "@nowcrm/services/server";


export async function uploadCSV(formData: FormData) {
	// we dont force async here because we dont force user to wait for the result
	dalService
		.uploadCSV(formData)
		.then(() => {
			console.log("Dal got the file");
		})
		.catch((err) => {
			console.error("Error uploading to DAL:", err);
		});

	return { ok: true };
}

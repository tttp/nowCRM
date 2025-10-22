"use server";

import dalService from "@/lib/services/new_type/dal.service";

export async function uploadCSV(formData: FormData) {
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

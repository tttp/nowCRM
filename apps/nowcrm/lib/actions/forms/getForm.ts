// contactsapp/lib/actions/forms/getForm.ts

"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import formService from "@/lib/services/new_type/forms.service";
import type { FormEntity } from "@/lib/types/new_type/form";

/**
 * Server action to fetch a form by its slug/ID
 * @param id The form ID or slug
 * @returns The form data or null if not found
 */
export async function getFormBySlugOrId(
	identifier: string | number,
	fromPublic: boolean = true,
	lengthOfResults: number = 1,
): Promise<StandardResponse<FormEntity[]>> {
	try {
		// 1. Build filters dynamically
		const isNumeric =
			typeof identifier === "number" || /^\d+$/.test(identifier);

		const filters = isNumeric
			? { id: { $eq: Number(identifier) } }
			: { slug: { $eq: String(identifier) } };

		// 2. Fetch with the chosen filter
		const response = await formService.find(
			{
				filters,
				populate: ["form_items", "cover", "logo"],
				sort: ["id:desc"],
				pagination: { page: 1, pageSize: lengthOfResults },
			},
			fromPublic,
		);

		// 3. Sort form_items by rank if available
		if (response.success && response.data?.length) {
			response.data = response.data.map((form) => ({
				...form,
				form_items: (form.form_items || [])
					.slice()
					.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
			}));
		}

		return response;
	} catch (error: any) {
		console.error("getFormBySlugOrId error:", error);
		throw error;
	}
}

/**
 * Server action to submit form data
 * @param formData The form submission data
 * @returns Success status and message
 */
export async function submitFormData(formData: {
	formId: number | undefined;
	identifier: string;
	formData: Record<string, any>;
}): Promise<{ success: boolean; message?: string }> {
	try {
		return await formService.submit(formData);
	} catch (error) {
		console.error("Error submitting form:", error);
		return {
			success: false,
			message: error instanceof Error ? error.message : "Failed to submit form",
		};
	}
}

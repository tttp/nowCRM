// contactsapp/lib/actions/forms/updateForm.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import type { StrapiImageFormat } from "@/lib/services/new_type/assets/asset";
import formItemsService from "@/lib/services/new_type/form_items.service";
import formsService from "@/lib/services/new_type/forms.service";
import type {
	CustomForm_FormItemEntity,
	Form_FormEntity,
	FormEntity,
} from "@/lib/types/new_type/form";
import { getFormBySlugOrId } from "./getForm";
export async function updateForm(
	formId: number,
	values: Form_FormEntity,
	items?: CustomForm_FormItemEntity[],
): Promise<StandardResponse<FormEntity>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		// Never pass media relations with the general update call
		const formOnly = { ...(values as any) };
		delete (formOnly as any).logo;
		delete (formOnly as any).cover;

		await formsService.update(formId, formOnly);

		const currentForm = await getFormBySlugOrId(formId, false);
		if (!currentForm.data || currentForm.data.length === 0) {
			return {
				data: null,
				status: 404,
				success: false,
				errorMessage: "Form not found",
			};
		}

		const existingItems = currentForm.data[0].form_items || [];
		const existingIds = existingItems.map((fi) => fi.id);
		const incomingIds = (items ?? []).filter((i) => i.id).map((i) => i.id!);
		const toDelete = existingIds.filter((eid) => !incomingIds.includes(eid));
		await Promise.all(toDelete.map((eid) => formItemsService.delete(eid)));

		if (items && items.length > 0) {
			await Promise.all(
				items.map(async (item) => {
					if (item.id) {
						await formItemsService.update(item.id, {
							name: item.name,
							type: item.type,
							label: item.label,
							options: item.options,
							rank: item.rank,
							required: item.required ?? false,
							hidden: item.hidden ?? false,
						});
					} else {
						const { ...form_item_fields } = item;
						await formItemsService.create({
							...form_item_fields,
							form: formId,
						});
					}
				}),
			);
		}

		const updated = await formsService.findOne(formId, {
			populate: ["form_items", "logo", "cover"],
		});

		return updated;
	} catch (error: any) {
		console.error("Error updating form or items:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: error.message,
		};
	}
}

export async function uploadCoverOrLogo(
	formData: FormData,
	targetField: "logo" | "cover",
): Promise<{ id: number; url: string }> {
	const files = formData.getAll("files") as File[];

	const formIdRaw = formData.get("formIdRaw");
	if (!formIdRaw) {
		throw new Error("uploadImage: missing formId in formData");
	}
	const formId = Number(formIdRaw);

	const result = await formsService.uploadCoverOrLogo(
		files,
		formId,
		targetField,
	);
	const assets = result.data;

	if (assets && assets.length > 0) {
		return { id: assets[0].id, url: assets[0].url };
	}
	return { id: -1, url: "placeholder.png" };
}

export async function eraseCoverOrLogo(
	strapiImage: StrapiImageFormat,
	targetField: string,
): Promise<string> {
	if (!strapiImage || !strapiImage.id) {
		throw new Error("Invalid image format: missing id.");
	}

	const result = await formsService.deleteCoverOrLogo(Number(strapiImage.id));

	if (!result.success) {
		throw new Error(`Failed to delete image from field ${targetField}.`);
	}

	return `Image for ${targetField} deleted successfully.`;
}

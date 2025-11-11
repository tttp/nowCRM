"use server";

import { deleteContactTitleAction } from "@/lib/actions/contact-titles/delete-contact-title";
import { DocumentId } from "@nowcrm/services";

export async function MassDeleteContactTitles(contactTitleIds: DocumentId[]) {
	try {
		const deletePromises = contactTitleIds.map((id) =>
			deleteContactTitleAction(id),
		);
		await Promise.all(deletePromises);
		return { success: true };
	} catch (error) {
		console.error("Mass delete error:", error);
		return { success: false };
	}
}

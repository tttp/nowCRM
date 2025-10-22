// contactsapp/lib/actions/contacts/getContactByEmail.ts

"use server";

import contactsService from "@/lib/services/new_type/contacts.service";
import type { Contact } from "@/lib/types/new_type/contact";

/**
 * Finds a contact by email (case-insensitive).
 * Returns the first matching Contact, or null if not found.
 */
export async function getContactByEmail(
	email: string,
): Promise<Contact | null> {
	if (!email || typeof email !== "string") {
		throw new Error("Invalid email provided");
	}

	const normalizedEmail = email.trim().toLowerCase();

	const response = await contactsService.find({
		populate: {
			subscriptions: { populate: ["id", "channel", "subscribedAt"] },
			contact_interests: "*",
		},
		filters: {
			email: { $eqi: normalizedEmail },
		},
	});

	if (Array.isArray(response.data) && response.data.length > 0) {
		return response.data[0];
	}

	return null;
}

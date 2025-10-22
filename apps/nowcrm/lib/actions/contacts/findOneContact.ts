"use server";
import contactsService from "@/lib/services/new_type/contacts.service";
import type { Contact } from "@/lib/types/new_type/contact";

export async function findContactByToken(
	unsubscribe_token: string,
): Promise<Contact | null> {
	if (!unsubscribe_token || typeof unsubscribe_token !== "string") {
		throw new Error("Invalid unsubscribe token provided");
	}

	// Use the exact match operator ($eq) to look for the given token.
	const response = await contactsService.find({
		populate: {
			subscriptions: { populate: ["id", "channel", "subscribedAt"] },
			contact_interests: "*",
		},
		filters: {
			unsubscribe_token: { $eqi: unsubscribe_token },
		},
	});
	console.log("Fetched contact with active subscriptions:");
	console.log(unsubscribe_token);
	console.log(response);

	// Since response.data is an array, return the first contact if available.
	if (Array.isArray(response.data) && response.data.length > 0) {
		return response.data[0];
	}

	return null;
}

// Define all acceptable sort strings explicitly (type-safe)
const SORT_OPTIONS = [
	"createdAt:asc",
	"createdAt:desc",
	"updatedAt:asc",
	"updatedAt:desc",
	"first_name:asc",
	"first_name:desc",
	"last_name:asc",
	"last_name:desc",
] as const;

// Narrow type to acceptable string literals
type SortOption = (typeof SORT_OPTIONS)[number];

// Randomly pick one from allowed values
function getRandomSort(): SortOption {
	const index = Math.floor(Math.random() * SORT_OPTIONS.length);
	return SORT_OPTIONS[index];
}

/**
 * Fetches a randomly sorted chunk of contacts and returns one random contact from that list.
 */
export async function findRandomContact(): Promise<Contact | null> {
	const randomSort = getRandomSort();

	const response = await contactsService.find({
		populate: {
			subscriptions: { populate: ["id", "channel", "subscribedAt"] },
			contact_interests: "*",
		},
		sort: [randomSort],
		pagination: {
			page: 1,
			pageSize: 100,
		},
	});

	if (!Array.isArray(response.data) || response.data.length === 0) {
		console.warn("No contacts found.");
		return null;
	}

	const randomIndex = Math.floor(Math.random() * response.data.length);
	const contact = response.data[randomIndex];
	return contact;
}

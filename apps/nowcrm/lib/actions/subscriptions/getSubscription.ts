"use server";
import { auth } from "@/auth";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";

export async function getSubscription(
	contactId: number,
	channelId: number,
): Promise<boolean> {
	const session = await auth();
	if (!session) return false;

	try {
		const existing = await subscriptionsService.find({
			filters: {
				contact: {
					id: { $eq: contactId },
				},
				channel: {
					id: { $eq: channelId },
				},
			},
			pagination: { limit: 1 },
		});
		return Array.isArray(existing.data) && existing.data.length > 0;
	} catch (error) {
		console.error("Error getting subscription:", error);
		return false;
	}
}

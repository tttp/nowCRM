// actions/update.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";
import type StrapiQuery from "@/lib/types/common/StrapiQuery";
import type {
	Form_Subscription,
	Subscription,
} from "@/lib/types/new_type/subscription";

export async function MassUpdateSubscription(
	contactIds: number[],
	channelId: number,
	isSubscribe: boolean,
): Promise<StandardResponse<Subscription[]>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const ops = contactIds.map(async (contactId) => {
			const options: StrapiQuery<Subscription> = {
				filters: {
					channel: { id: { $eq: channelId } },
					contact: { id: { $eq: contactId } },
				},
			};

			const findRes = await subscriptionsService.find(options, false);
			if (!findRes.success) {
				throw new Error(`Can't find subscription for contact=${contactId}`);
			}

			const existing = findRes.data?.[0] ?? null;

			if (existing) {
				if (isSubscribe) {
					if (!existing.active) {
						const updateRes = await subscriptionsService.update(
							existing.id,
							{ active: true, subscribed_at: new Date() },
							false,
						);
						if (!updateRes.success || !updateRes.data) {
							throw new Error(`Can't activate subscription id=${existing.id}`);
						}
						return updateRes.data;
					}
				} else {
					if (existing.active) {
						const updateRes = await subscriptionsService.update(
							existing.id,
							{ active: false },
							false,
						);
						if (!updateRes.success || !updateRes.data) {
							throw new Error(
								`Can't deactivate subscription id=${existing.id}`,
							);
						}
						return updateRes.data;
					}
				}
				return existing;
			}

			if (isSubscribe) {
				const createRes = await subscriptionsService.create(
					{
						channel: channelId,
						contact: contactId,
						subscribed_at: new Date(),
						active: true,
					} as Form_Subscription,
					false,
				);
				if (!createRes.success || !createRes.data) {
					throw new Error(`Can't create subscription for contact=${contactId}`);
				}
				return createRes.data;
			}

			return null;
		});

		const results = (await Promise.all(ops)).filter(
			(x): x is Subscription => x !== null,
		);

		return { data: results, status: 200, success: true };
	} catch (error: any) {
		console.error("MassUpdateSubscription error:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: error.message || String(error),
		};
	}
}

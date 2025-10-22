// contactsapp/lib/actions/signup/dataFetch.ts
"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import channelService from "@/lib/services/new_type/channel.service";
import contactInterestsService from "@/lib/services/new_type/contact_interests.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import subscriptionsService from "@/lib/services/new_type/subscriptions.service";
import type { Contact, Form_Contact } from "@/lib/types/new_type/contact";

export interface ItemProps {
	value: number;
	label: string;
}

// Internal helper functions that do the actual fetching.
async function fetchAllChannels(): Promise<ItemProps[]> {
	const response = await channelService.find({ sort: ["id:asc"] }, true);
	return (
		response.data?.map((channel: any) => ({
			value: channel.id,
			label: channel.name,
		})) || []
	);
}

async function fetchAllInterests(): Promise<ItemProps[]> {
	const response = await contactInterestsService.find(
		{ sort: ["id:asc"] },
		true,
	);

	return (
		response.data?.map((interest) => ({
			value: interest.id,
			label: interest.name,
		})) || []
	);
}

export async function getChannels(): Promise<ItemProps[]> {
	return fetchAllChannels();
}

export async function getInterests(): Promise<ItemProps[]> {
	return fetchAllInterests();
}

// to test with http://localhost:3000/en/signup?unsubscribe_token=f2bbcc56-b17d-4937-933f-12d0acac47c7
export async function upsertSubscription(
	contact_data: Form_Contact,
	channel_ids: number[],
): Promise<StandardResponse<Contact>> {
	try {
		let contactResponse: StandardResponse<Contact>;
		// Object to track subscription updates for logging.
		const subscriptionsUpdate = {
			disconnect: [] as any[],
			connect: [] as any[],
		};

		// ----- Normalize the new interest IDs -----
		let newInterestIds: number[] = [];
		if (Array.isArray(contact_data.contact_interests)) {
			newInterestIds = contact_data.contact_interests.filter(
				(id): id is number => id !== undefined,
			);
		} else if (
			contact_data.contact_interests &&
			typeof contact_data.contact_interests === "object"
		) {
			newInterestIds =
				Array.isArray(contact_data.contact_interests.connect) &&
				contact_data.contact_interests.connect.length > 0
					? contact_data.contact_interests.connect.filter(
							(id: any): id is number => id !== undefined,
						)
					: [];
		}
		console.log("Normalized interest IDs:", newInterestIds);

		// ----- Normalize & Deduplicate the new channel IDs -----
		const newChannelIds: number[] = Array.from(
			new Set(channel_ids.map((id) => Number(id))),
		);
		console.log("Normalized channel IDs:", newChannelIds);

		// ------------------------------
		// CASE 1: Existing Contact Found
		// ------------------------------
		if (contact_data.unsubscribe_token) {
			console.log("I'm checking by unsubscribe token");
			const findResponse = await contactsService.find({
				filters: {
					unsubscribe_token: { $eqi: contact_data.unsubscribe_token },
				},
				populate: { subscriptions: "*", contact_interests: "*" },
			});

			if (findResponse.data && findResponse.data.length > 0) {
				const existingContact = findResponse.data[0];

				// Update basic contact details.
				const updateData = {
					email: contact_data.email,
					phone: contact_data.phone,
					first_name: contact_data.first_name,
					last_name: contact_data.last_name,
				};
				contactResponse = await contactsService.update(
					existingContact.id,
					updateData,
				);

				// Process subscriptions (channels).
				const existingSubs = existingContact.subscriptions || [];
				// Group existing subscriptions by channel ID.
				const subsByChannel = new Map<number, any[]>();
				for (const sub of existingSubs) {
					if (sub.channel && sub.channel.id != null) {
						const cid = Number(sub.channel.id);
						if (!subsByChannel.has(cid)) {
							subsByChannel.set(cid, []);
						}
						subsByChannel.get(cid)?.push(sub);
					} else {
						console.warn(
							`Subscription ${sub.id} has no valid channel; skipping grouping.`,
						);
					}
				}
				console.log(
					"Existing subscriptions grouped by channel:",
					subsByChannel,
				);

				// If no new channels are provided, disconnect all existing subscriptions.
				if (newChannelIds.length === 0) {
					for (const subs of subsByChannel.values()) {
						for (const sub of subs) {
							if (sub.active) {
								const updatedSub = await subscriptionsService.update(sub.id, {
									active: false,
									unsubscribed_at: new Date().toISOString(),
								});
								subscriptionsUpdate.disconnect.push(updatedSub);
							}
						}
					}
					console.log(
						"No new channels provided. All existing subscriptions deactivated:",
						subscriptionsUpdate,
					);
				} else {
					// Otherwise, for channels not in the new list, disconnect them.
					for (const [cid, subs] of subsByChannel.entries()) {
						if (!newChannelIds.includes(cid)) {
							for (const sub of subs) {
								if (sub.active) {
									const updatedSub = await subscriptionsService.update(sub.id, {
										active: false,
										unsubscribed_at: new Date().toISOString(),
									});
									subscriptionsUpdate.disconnect.push(updatedSub);
								}
							}
						}
					}

					// For each channel in the new list, process active subscriptions.
					for (const c_id of newChannelIds) {
						const subs = subsByChannel.get(c_id) || [];
						if (subs.length > 0) {
							// Choose the subscription with the latest subscribed_at as the primary subscription.
							const mainSub = subs.reduce((prev, curr) => {
								const prevTime = new Date(prev.subscribed_at).getTime() || 0;
								const currTime = new Date(curr.subscribed_at).getTime() || 0;
								return currTime > prevTime ? curr : prev;
							});
							let activeSub = mainSub;
							if (!activeSub.active) {
								activeSub = await subscriptionsService.update(activeSub.id, {
									active: true,
									subscribed_at: new Date(),
									publishedAt: new Date(),
								});
							}
							subscriptionsUpdate.connect.push(activeSub);
							// Deactivate any duplicate subscriptions for this channel.
							for (const sub of subs) {
								if (sub.id !== activeSub.id && sub.active) {
									const updatedSub = await subscriptionsService.update(sub.id, {
										active: false,
										unsubscribed_at: new Date().toISOString(),
									});
									subscriptionsUpdate.disconnect.push(updatedSub);
								}
							}
						} else {
							// No subscription exists for this channel; create one.
							const channel = await channelService.findOne(c_id, {}, true);
							const newSubscription = await subscriptionsService.create(
								{
									channel: channel.data?.id || 1,
									active: true,
									subscribed_at: new Date(),
									publishedAt: new Date(),
									contact: existingContact.id,
								},
								true,
							);
							subscriptionsUpdate.connect.push(newSubscription);
						}
					}
				}
				console.log("Subscriptions update process:", subscriptionsUpdate);

				// Process interests (contact_interests) using connect/disconnect logic.
				const existingInterestIds: number[] = existingContact.contact_interests
					? existingContact.contact_interests.map((i: any) => i.id)
					: [];
				const interestsToDisconnect = existingInterestIds.filter(
					(id: number) => !newInterestIds.includes(id),
				);
				const interestsToConnect = newInterestIds.filter(
					(id: number) => !existingInterestIds.includes(id),
				);
				const interestUpdateData = {
					contact_interests: {
						connect: interestsToConnect,
						disconnect: interestsToDisconnect,
					},
				};
				await contactsService.update(existingContact.id, interestUpdateData);
				console.log(
					"Interests update - connect:",
					interestsToConnect,
					"disconnect:",
					interestsToDisconnect,
				);

				return contactResponse;
			}
		}

		// ------------------------------
		// CASE 2: New Contact (or no matching unsubscribe token)
		// ------------------------------
		contactResponse = await contactsService.create(contact_data, true);
		if (newChannelIds.length > 0) {
			for (const c_id of newChannelIds) {
				const channel = await channelService.findOne(c_id, {}, true);
				const newSubscription = await subscriptionsService.create(
					{
						channel: channel.data?.id || 1,
						active: true,
						subscribed_at: new Date(),
						publishedAt: new Date(),
						contact: contactResponse.data!.id,
					},
					true,
				);
				subscriptionsUpdate.connect.push(newSubscription);
			}
		} else {
			console.log(
				"No channels provided for new contact. No subscriptions created.",
			);
		}

		await contactsService.update(
			contactResponse.data!.id,
			{
				contact_interests: { connect: newInterestIds },
			},
			true,
		);

		return contactResponse;
	} catch (error: any) {
		throw new Error(`Error creating subscription: ${error.message}`);
	}
}

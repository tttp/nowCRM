// actions/deleteContactAction.ts
"use server";
import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import journeyStepsService from "@/lib/services/new_type/journeySteps.service";
import journeysService from "@/lib/services/new_type/journeys.service";
import type { Contact } from "@/lib/types/new_type/contact";
import type { addContactsToStepData } from "./add-contacts-dialog";

async function propagateContactsToJourney(
	stepId: number,
	contactIds: number[],
) {
	const step = await journeyStepsService.findOne(stepId, {
		populate: {
			journey: {
				populate: {
					contacts: true,
				},
			},
		},
	});

	if (!step?.data?.journey?.id) return;

	const journeyId = step.data.journey.id;
	const existingContacts =
		step.data.journey.contacts?.map((c: Contact) => c.id) || [];
	const allJourneyContacts = Array.from(
		new Set([...existingContacts, ...contactIds]),
	);

	await journeysService.update(journeyId, {
		contacts: { connect: allJourneyContacts },
	});
}

export async function addToStepAction(
	data: addContactsToStepData,
): Promise<StandardResponse<boolean>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}
	try {
		if (data.type === "list" && typeof data.contacts === "number") {
			let allContacts: Contact[] = [];
			const list_contacts = await contactsService.find({
				filters: { lists: { id: { $in: data.contacts } } },
				populate: {
					subscriptions: {
						populate: {
							channel: true,
						},
					},
				},
			});

			if (!list_contacts.data || !list_contacts.meta) {
				return {
					data: null,
					status: 400,
					success: false,
					errorMessage: "Probably strapi is down",
				};
			}

			allContacts = [...list_contacts.data];
			let currentPage = list_contacts.meta.pagination.page;
			const totalPages = list_contacts.meta.pagination.pageCount;

			while (currentPage < totalPages) {
				currentPage++;
				const result = await contactsService.find({
					filters: { lists: { id: { $in: data.contacts } } },
					populate: {
						subscriptions: {
							populate: {
								channel: true,
							},
						},
					},
					pagination: { page: currentPage },
				});

				if (result.data) {
					allContacts = allContacts.concat(result.data as Contact[]);
				}
			}

			const list_ids = allContacts.map((contact) => contact.id);

			await journeyStepsService.update(data.step_id, {
				contacts: { connect: list_ids },
			});
			await propagateContactsToJourney(data.step_id, list_ids);
			return {
				data: true,
				status: 200,
				success: true,
				errorMessage: "",
			};
		}

		if (data.type === "organization" && typeof data.contacts === "number") {
			let allContacts: Contact[] = [];
			const organization_contacts = await contactsService.find({
				filters: { organization: { id: { $eq: data.contacts } } },
				populate: {
					subscriptions: {
						populate: {
							channel: true,
						},
					},
				},
			});

			if (!organization_contacts.data || !organization_contacts.meta) {
				return {
					data: null,
					status: 400,
					success: false,
					errorMessage: "Probably strapi is down",
				};
			}

			allContacts = [...organization_contacts.data];
			let currentPage = organization_contacts.meta.pagination.page;
			const totalPages = organization_contacts.meta.pagination.pageCount;

			while (currentPage < totalPages) {
				currentPage++;
				const result = await contactsService.find({
					filters: { lists: { id: { $in: data.contacts } } },
					populate: {
						subscriptions: {
							populate: {
								channel: true,
							},
						},
					},
					pagination: { page: currentPage },
				});

				if (result.data) {
					allContacts = allContacts.concat(result.data as Contact[]);
				}
			}

			const org_ids = allContacts.map((contact) => contact.id);

			await journeyStepsService.update(data.step_id, {
				contacts: { connect: org_ids },
			});
			await propagateContactsToJourney(data.step_id, org_ids);
			return {
				data: true,
				status: 200,
				success: true,
				errorMessage: "",
			};
		}

		if (data.type === "contact" && typeof data.contacts === "number") {
			await journeyStepsService.update(data.step_id, {
				contacts: { connect: [data.contacts] },
			});
			await propagateContactsToJourney(data.step_id, [data.contacts]);
			return {
				data: true,
				status: 200,
				success: true,
				errorMessage: "",
			};
		}
		return {
			data: null,
			status: 400,
			success: false,
			errorMessage: "Probably strapi is down",
		};
	} catch (_error: any) {
		return {
			data: null,
			status: 400,
			success: false,
			errorMessage: "error",
		};
	}
}

// actions/deleteContactAction.ts
"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import journeyStepsService from "@/lib/services/new_type/journeySteps.service";
import journeysService from "@/lib/services/new_type/journeys.service";
import type { Contact } from "@/lib/types/new_type/contact";

export async function removeFromStepContact(
	contactId: number,
	stepId: number,
): Promise<StandardResponse<Contact>> {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		// 1. Remove contact from the step
		const response = await contactsService.update(contactId, {
			journey_steps: { disconnect: [stepId] },
		});

		// 2. Fetch the step to get its journey
		const step = await journeyStepsService.findOne(stepId, {
			populate: {
				journey: {
					populate: {
						journey_steps: {
							populate: {
								contacts: true,
							},
						},
					},
				},
			},
		});

		const journey = step?.data?.journey;
		if (!journey?.id) {
			return response; // no journey found, return
		}

		// 3. Check if contact exists in other steps of the same journey
		const contactStillInOtherSteps = journey.journey_steps.some((step: any) =>
			step.contacts.some((contact: Contact) => contact.id === contactId),
		);

		if (!contactStillInOtherSteps) {
			// 4. Remove from journey as well
			await journeysService.update(journey.id, {
				contacts: { disconnect: [contactId] },
			});
		}

		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to remove contact from step and journey");
	}
}

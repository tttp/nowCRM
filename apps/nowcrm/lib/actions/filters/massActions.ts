"use server";

import type { StandardResponse } from "@/lib/services/common/response.service";
import composerService from "@/lib/services/new_type/composer.service";
import dalService from "@/lib/services/new_type/dal.service";

export async function deleteContactsByFilters(payload: {
	entity: string;
	searchMask: Record<string, any>;
	mass_action: string;
}): Promise<StandardResponse<any>> {
	return await dalService.deleteContactsByFilters(payload);
}

export async function exportContactsByFilters(payload: {
	entity: string;
	searchMask: Record<string, any>;
	mass_action: string;
}): Promise<StandardResponse<any>> {
	return await dalService.exportContactsByFilters(payload);
}

export async function addContactsToListByFilters(
	filters: Record<string, any>,
	listId: number,
): Promise<StandardResponse<any>> {
	return await dalService.addContactsToListByFilters(filters, listId);
}

export async function updateContactsByFilters(
	filters: Record<string, any>,
	updateData: Record<string, any>,
): Promise<StandardResponse<any>> {
	return await dalService.updateContactsByFilters(filters, updateData);
}

export async function UpdateSubscriptionContactsByFilters(
	filters: Record<string, any>,
	channelId: number,
	isSubscribe: boolean,
): Promise<StandardResponse<any>> {
	return await dalService.UpdateSubscriptionContactsByFilters(
		filters,
		channelId,
		isSubscribe,
	);
}

export async function addContactsToJourneyByFilters(
	filters: Record<string, any>,
	organisationId: number,
): Promise<StandardResponse<any>> {
	return await dalService.addContactsToJourneyByFilters(
		filters,
		organisationId,
	);
}

export async function addContactsToOrganizationByFilters(
	filters: Record<string, any>,
	organisationId: number,
): Promise<StandardResponse<any>> {
	return await dalService.addContactsToOrganizationByFilters(
		filters,
		organisationId,
	);
}

export async function anonymizeContactsByFilters(payload: {
	entity: string;
	searchMask: Record<string, any>;
	mass_action: string;
}): Promise<StandardResponse<any>> {
	return await dalService.anonymizeContactsByFilters(payload);
}

export async function sendCompositionByFilters(
	filters: Record<string, any>,
	compositionId: number,
	channelNames: string[],
	subject: string,
	from: string,
	interval: number,
): Promise<StandardResponse<any>> {
	return await composerService.sendCompositionByFilters(
		filters,
		compositionId,
		channelNames,
		subject,
		from,
		interval,
	);
}

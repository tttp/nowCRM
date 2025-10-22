"use server";

import { auth } from "@/auth";
import type { StandardResponse } from "@/lib/services/common/response.service";
import contactInterestsService from "@/lib/services/new_type/contact_interests.service";
import contactSalutationsService from "@/lib/services/new_type/contact_salutation";
import contactTitlesService from "@/lib/services/new_type/contact_title";
import contactTypesService from "@/lib/services/new_type/contact_type.service";
import contactsService from "@/lib/services/new_type/contacts.service";
import departmentService from "@/lib/services/new_type/department.service";
import industriesService from "@/lib/services/new_type/industry.service";
import jobTitleService from "@/lib/services/new_type/job_title.service";
import keywordsService from "@/lib/services/new_type/keywords.service";
import notesService from "@/lib/services/new_type/notes.service";
import organizationService from "@/lib/services/new_type/organizations.service";
import ranksService from "@/lib/services/new_type/rank.service";
import sourcesService from "@/lib/services/new_type/source.service";
import tagsService from "@/lib/services/new_type/tags.service";
import type { Contact } from "@/lib/types/new_type/contact";

// Map each relation field to its service
const relationServiceMap = {
	organization: organizationService,
	contact_interests: contactInterestsService,
	department: departmentService,
	keywords: keywordsService,
	job_title: jobTitleService,
	ranks: ranksService,
	contact_types: contactTypesService,
	sources: sourcesService,
	notes: notesService,
	industry: industriesService,
	title: contactTitlesService,
	salutation: contactSalutationsService,
	tags: tagsService,
} as const;

export async function MassUpdateContactField(
	contactIds: number[],
	field: string,
	value: string,
): Promise<StandardResponse<Contact[]>> {
	const session = await auth();
	if (!session) {
		return { data: null, status: 403, success: false };
	}

	try {
		const isRelation = field in relationServiceMap;
		let processedValue: string | number | number[];

		if (isRelation) {
			const names = value
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

			const svc = (relationServiceMap as any)[field] as {
				find: (
					opts: any,
					isPublic?: boolean,
				) => Promise<StandardResponse<any[]>>;
				create: (
					payload: any,
					isPublic?: boolean,
				) => Promise<StandardResponse<any>>;
			};

			const ids = await Promise.all(
				names.map(async (name) => {
					const found = await svc.find(
						{ filters: { name: { $eq: name } } },
						/* isPublic */ true,
					);
					if (found.success && found.data && found.data.length > 0) {
						return found.data[0].id;
					}

					const created = await svc.create({ name }, /* isPublic */ true);
					if (!created.success || !created.data) {
						throw new Error(
							`Failed to create "${field}" relation with name "${name}"`,
						);
					}
					return created.data.id;
				}),
			);

			processedValue = ids.length === 1 ? ids[0] : ids;
		} else {
			processedValue = value;
		}

		const updateData = { [field]: processedValue };

		const updatePromises = contactIds.map((cid) =>
			contactsService.update(cid, updateData),
		);
		const results = await Promise.allSettled(updatePromises);

		const successful = results
			.filter(
				(r): r is PromiseFulfilledResult<any> =>
					r.status === "fulfilled" && r.value.success,
			)
			.map((r) => r.value.data);

		const failedCount = results.length - successful.length;
		if (failedCount > 0) {
			console.warn(`${failedCount} contact updates failed`);
		}

		return { data: successful, status: 200, success: true };
	} catch (error) {
		console.error("Error in MassUpdateContactField:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

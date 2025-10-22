"use server";

import { fieldsFromVisible } from "@/lib/generateFieldsPopulate";
import ServiceFactory, {
	type ServiceName,
} from "@/lib/services/common/serviceFactory";

export async function fetchDataForVisibleColumns(input: {
	visibleIds: string[];
	page: number;
	pageSize: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
	filters?: any;
	serviceName: ServiceName;
}) {
	const {
		visibleIds,
		page,
		pageSize,
		sortBy,
		sortOrder,
		filters,
		serviceName,
	} = input;

	const fields = fieldsFromVisible(visibleIds, [
		sortBy,
		"id",
		"createdAt",
		"updatedAt",
	]);
	const service = ServiceFactory.getService(serviceName);

	return await service.find({
		fields: fields as any,
		populate: {
			salutation: { fields: ["name"] },
			title: { fields: ["name"] },
			subscriptions: {
				fields: ["active"],
				populate: { channel: { fields: ["name"] } },
			},
			organization: { fields: ["name"] },
			department: { fields: ["name"] },
			job_title: { fields: ["name"] },
			industry: { fields: ["name"] },
			contact_types: { fields: ["name"] },
			lists: { fields: ["name"] },
			keywords: { fields: ["name"] },
			contact_interests: { fields: ["name"] },
			journeys: { fields: ["name"] },
			journey_steps: { fields: ["name"] },
			survey_items: { fields: ["question", "answer"] },
			tags: { fields: ["name", "color"] },
		},
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: { page, pageSize },
		filters: { ...(filters ?? {}) },
	});
}

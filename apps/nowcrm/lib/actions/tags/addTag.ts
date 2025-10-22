"use server";

import { auth } from "@/auth";
import ServiceFactory, {
	type ServiceName,
} from "@/lib/services/common/serviceFactory";

export async function addTag(
	serviceName: ServiceName,
	entityId: number,
	tagId: number,
) {
	const session = await auth();
	if (!session) {
		return {
			data: null,
			status: 403,
			success: false,
		};
	}

	try {
		const service = ServiceFactory.getService(serviceName);
		const res = await service.update(entityId, {
			tags: { connect: [tagId] },
		});
		console.log(res);
		return res;
	} catch (error) {
		console.error("Error adding tag:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

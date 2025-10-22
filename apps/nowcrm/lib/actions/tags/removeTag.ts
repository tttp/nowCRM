"use server";

import { auth } from "@/auth";
import ServiceFactory, {
	type ServiceName,
} from "@/lib/services/common/serviceFactory";

export async function removeTag(
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
			tags: { disconnect: [tagId] },
		});
		return res;
	} catch (error) {
		console.error("Error removing tag:", error);
		return {
			data: null,
			status: 500,
			success: false,
			errorMessage: `${error}`,
		};
	}
}

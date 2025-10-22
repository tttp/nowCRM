"use server";

import { auth } from "@/auth";
import ServiceFactory, {
	type ServiceName,
} from "@/lib/services/common/serviceFactory";
import type StrapiQuery from "@/lib/types/common/StrapiQuery";
//TODO: remove here any types

export async function findData(
	serviceName: ServiceName,
	options?: StrapiQuery<any>,
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
		const response = await service.find(options as any);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch item");
	}
}

export async function findSingleData(
	serviceName: ServiceName,
	id: number,
	options?: StrapiQuery<any>,
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
		const response = await service.findOne(id, options as any);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch item");
	}
}

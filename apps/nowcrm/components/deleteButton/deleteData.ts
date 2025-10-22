"use server";
import { auth } from "@/auth";
import ServiceFactory, {
	type ServiceName,
} from "@/lib/services/common/serviceFactory";
export async function DeleteData(serviceName: ServiceName, id: number) {
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
		const response = await service.unPublish(id);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch item");
	}
}

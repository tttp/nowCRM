import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { ImportRecord } from "@/lib/types/new_type/import";
import APIRoutes from "../../http/apiRoutes";
import type { StandardResponse } from "../common/response.service";

class DalService {
	private static instance: DalService;

	public static getInstance(): DalService {
		if (!DalService.instance) {
			DalService.instance = new DalService();
		}
		return DalService.instance;
	}

	async fetchPreviousImports(
		page = 1,
		jobsPerPage = 20,
		type: "contacts" | "organizations" | "mass-actions" = "contacts",
	): Promise<StandardResponse<ImportRecord[]>> {
		const session = await auth();
		if (!session) {
			console.warn("⚠️ No session found");
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_DAL_API_URL}${APIRoutes.DAL.QUEUE_DATA}?page=${page}&jobsPerPage=${jobsPerPage}&type=${type}`;

			const response = await fetch(url, {
				cache: "no-store",
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(" Response not OK:", errorText);
				throw new Error("Failed to load data");
			}

			const data = await response.json();
			const jobsRaw = data.responseObject?.jobs;

			if (!Array.isArray(jobsRaw)) {
				return {
					data: null,
					status: 500,
					success: false,
					errorMessage: "Invalid jobs format",
				};
			}

			const jobs: ImportRecord[] = jobsRaw.map((job: any) => ({
				id: job.id,
				filename: job.filename,
				createdAt: job.createdAt,
				status: job.status ?? "",
				type: job.type,
				progressPercent: job.progressPercent ?? 0,
				jobId: job.jobId ?? job.id,
				failedContacts: Array.isArray(job.failedContacts)
					? job.failedContacts
					: [],
				failedOrgs: Array.isArray(job.failedOrgs) ? job.failedOrgs : [],
				massAction: job.massAction ?? null,
				listName: job.listName ?? null,
				listField: job.listField ?? null,
				parsedSearchMask: job.parsedSearchMask ?? "",
			}));

			return {
				data: jobs,
				status: 200,
				success: true,
			};
		} catch (error: any) {
			console.error(" Error loading data:", error);
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "Failed to load previous imports",
			};
		}
	}

	async uploadCSV(formData: FormData): Promise<any> {
		const file = formData.get("file") as File;
		const filename = formData.get("filename") as string;
		const type = formData.get("type") as string;
		const mapping = JSON.parse(formData.get("mapping") as string);
		const requiredColumns = JSON.parse(
			formData.get("requiredColumns") as string,
		);
		const selectedColumns = JSON.parse(
			formData.get("selectedColumns") as string,
		);
		const extraColumns = JSON.parse(formData.get("extraColumns") as string);
		const subscribeAll = formData.get("subscribeAll") as string;
		const deduplicateByRequired = formData.get(
			"deduplicateByRequired",
		) as string;
		const listMode = formData.get("listMode") as string;
		const listId = formData.get("listId") as string;

		const upstreamFormData = new FormData();
		upstreamFormData.append("file", file);
		upstreamFormData.append("filename", filename);
		upstreamFormData.append("type", type);
		upstreamFormData.append("mapping", JSON.stringify(mapping));
		upstreamFormData.append("requiredColumns", JSON.stringify(requiredColumns));
		upstreamFormData.append("selectedColumns", JSON.stringify(selectedColumns));
		upstreamFormData.append("extraColumns", JSON.stringify(extraColumns));
		upstreamFormData.append("subscribeAll", subscribeAll);
		upstreamFormData.append("deduplicateByRequired", deduplicateByRequired);
		upstreamFormData.append("listMode", listMode);
		upstreamFormData.append("listId", listId);

		const res = await fetch(`${env.CRM_DAL_API_URL}${APIRoutes.DAL.UPLOAD}`, {
			method: "POST",
			body: upstreamFormData,
			cache: "no-store",
		});

		if (!res.ok) {
			console.error(await res.text());
			throw new Error("DAL API failed");
		}

		return await res.json();
	}

	async deleteContactsByFilters(payload: {
		entity: string;
		searchMask: any;
		mass_action: string;
	}): Promise<StandardResponse<any>> {
		const session = await auth();

		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const transformedFilters = payload.searchMask;

			const updatedPayload = {
				...payload,
				searchMask: transformedFilters,
			};

			console.log("[API] Deleting contacts with payload:", updatedPayload);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_DELETE}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedPayload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Delete failed:", errorText);
				throw new Error("Failed to delete contacts");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Delete error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to delete contacts",
			};
		}
	}

	async exportContactsByFilters(payload: {
		entity: string;
		searchMask: any;
		mass_action: string;
	}): Promise<StandardResponse<any>> {
		const session = await auth();

		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		const userEmail = session.user?.email ?? "unknown@unknown.com";

		try {
			const transformedFilters = payload.searchMask;

			const updatedPayload = {
				...payload,
				searchMask: transformedFilters,
				userEmail,
			};
			console.log(`[Export] Requested by user: ${userEmail}`);
			console.log("[API] Export contacts with payload:", updatedPayload);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_EXPORT}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedPayload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Export failed:", errorText);
				throw new Error("Failed to export contacts");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Export error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to export contacts",
			};
		}
	}

	async addContactsToListByFilters(
		filters: Record<string, any>,
		listId: number,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const payload = {
				entity: "contacts",
				searchMask: filters,
				mass_action: "add_to_list",
				list_id: listId,
			};

			console.log(">>> ADD TO LIST PAYLOAD:", JSON.stringify(payload, null, 2));

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_ADD_TO_LIST}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Add to list failed:", errorText);
				throw new Error("Failed to add contacts to list");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Add to list error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to add contacts to list",
			};
		}
	}

	async fetchProgressMap(): Promise<StandardResponse<Map<string, number>>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const response = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.PROGRESS}`,
				{
					cache: "no-store",
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch progress map");
			}

			const data = await response.json();
			const progressMap = new Map<string, number>(
				data.progress.map((item: any) => [
					item.jobId,
					Number(item.progressPercent),
				]),
			);

			return {
				data: progressMap,
				status: 200,
				success: true,
			};
		} catch (error: any) {
			console.error("Error fetching progress map:", error);
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "Failed to fetch progress map",
			};
		}
	}

	async updateContactsByFilters(
		filters: Record<string, any>,
		updateData: Record<string, any>,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const payload = {
				entity: "contacts",
				searchMask: filters,
				mass_action: "update",
				update_data: updateData,
			};

			console.log(
				"[API] Updating contacts with payload:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_UPDATE}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Update contacts failed:", errorText);
				throw new Error("Failed to update contacts");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Update contacts error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to update contacts",
			};
		}
	}

	async addContactsToJourneyByFilters(
		filters: Record<string, any>,
		listId: number,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const payload = {
				entity: "contacts",
				searchMask: filters,
				mass_action: "add_to_journey",
				list_id: listId,
			};

			console.log(
				">>> ADD TO Journey PAYLOAD:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_ADD_TO_JOURNEY}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Add to Journey failed:", errorText);
				throw new Error("Failed to add contacts to Journey");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Add to Journey organization:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to add contacts to Journey",
			};
		}
	}

	async UpdateSubscriptionContactsByFilters(
		filters: Record<string, any>,
		channelId: number,
		isSubscribe: boolean,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const payload = {
				entity: "contacts",
				searchMask: filters,
				mass_action: "update_subscription",
				channelId: channelId,
				isSubscribe: isSubscribe,
			};

			console.log(
				">>> Update Subcripition PAYLOAD:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_UPDATE_SUBSCRIPTION}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Updating subscription failed:", errorText);
				throw new Error("Failed to update subscription to contacts");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Updating subscription:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to update subscription",
			};
		}
	}

	async addContactsToOrganizationByFilters(
		filters: Record<string, any>,
		organizationId: number,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const payload = {
				entity: "contacts",
				searchMask: filters,
				mass_action: "add_to_organization",
				organization_id: organizationId,
			};

			console.log(">>> ADD TO Orgs PAYLOAD:", JSON.stringify(payload, null, 2));

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_ADD_TO_ORGANIZATION}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Add to list failed:", errorText);
				throw new Error("Failed to add contacts to organization");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Add to list organization:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to add contacts to organization",
			};
		}
	}

	async anonymizeContactsByFilters(payload: {
		entity: string;
		searchMask: any;
		mass_action: string;
	}): Promise<StandardResponse<any>> {
		const session = await auth();

		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const transformedFilters = payload.searchMask;

			const updatedPayload = {
				...payload,
				searchMask: transformedFilters,
			};

			console.log("[API] Anonymized contacts with payload:", updatedPayload);

			const res = await fetch(
				`${env.CRM_DAL_API_URL}${APIRoutes.DAL.MASS_ANONYMIZE}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedPayload),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Delete anonymized:", errorText);
				throw new Error("Anonymized to delete contacts");
			}

			return {
				data: await res.json(),
				status: res.status,
				success: true,
			};
		} catch (error: any) {
			console.error("Anonymize error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to delete contacts",
			};
		}
	}
}

const dalService = DalService.getInstance();
export default dalService;

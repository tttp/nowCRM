import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type {
	Composition,
	createAdditionalComposition,
	createComposition,
	Form_Composition,
	JobCompositionRecord,
	QuickWriteModel,
	ReferenceComposition,
	StructuredResponseModel,
} from "@/lib/types/new_type/composition";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import type { StandardResponse } from "../common/response.service";

class ComposerService extends BaseService<Composition, Form_Composition> {
	private static instance: ComposerService;

	private constructor() {
		super(APIRoutes.COMPOSITIONS);
	}

	/**
	 * Retrieves the singleton instance of ComposerService.
	 * @returns {ComposerService} - The singleton instance.
	 */
	public static getInstance(): ComposerService {
		if (!ComposerService.instance) {
			ComposerService.instance = new ComposerService();
		}
		return ComposerService.instance;
	}

	async createReference(
		data: ReferenceComposition,
	): Promise<StandardResponse<{ result: string }>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_COMPOSER_API_URL}composer/create-reference`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store",
				body: JSON.stringify(data),
			});
			const reference = await response.json();
			return {
				data: reference.responseObject,
				status: reference.status,
				success: reference.success,
				errorMessage: reference.message,
			};
		} catch (error: any) {
			console.log(error);
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "error",
			};
		}
	}

	async quickWrite(
		data: QuickWriteModel,
	): Promise<StandardResponse<{ result: string }>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_COMPOSER_API_URL}composer/quick-write`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store",
				body: JSON.stringify(data),
			});
			const reference = await response.json();
			return {
				data: reference.responseObject,
				status: reference.status,
				success: reference.success,
				errorMessage: reference.message,
			};
		} catch (error: any) {
			console.log(error);
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: "error",
			};
		}
	}

	async requestStructuredResponse(
		data: StructuredResponseModel,
	): Promise<StandardResponse<{ result: string }>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_COMPOSER_API_URL}composer/structured-response`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store",
				body: JSON.stringify(data),
			});
			const json = await response.json();

			return {
				data: json.responseObject,
				status: json.status,
				success: json.success,
				errorMessage: json.message,
			};
		} catch (error: any) {
			console.error("Structured response error:", error);
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: "Failed to fetch structured response",
			};
		}
	}

	async regenerateItemResult(
		data: createAdditionalComposition,
	): Promise<StandardResponse<string>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_COMPOSER_API_URL}composer/regenerate`;
			const rez = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store",
				body: JSON.stringify(data),
			});
			const response = await rez.json();
			return {
				data: response.responseObject.result,
				status: 200,
				success: true,
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

	async createComposition(
		data: createComposition,
	): Promise<StandardResponse<string>> {
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_COMPOSER_API_URL}composer/create-composition`;
			const rez = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store",
				body: JSON.stringify(data),
			});
			const response = await rez.json();
			return {
				data: response.responseObject.id,
				status: 200,
				success: true,
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
	async sendCompositionByIds(
		contactIds: number[],
		compositionId: number,
		channelNames: string[],
		subject: string,
		from: string,
		interval: number,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return { data: null, status: 403, success: false };
		}

		try {
			const payload = {
				composition_id: compositionId,
				to: contactIds,
				type: "contact",
				channels: channelNames.map((c) => c.toLowerCase()),
				subject,
				from,
				interval,
			};

			console.log(
				">>> Send to channels payload:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
				`${env.CRM_COMPOSER_API_URL}${APIRoutes.COMPOSITION.SEND}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			const raw = await res.text();
			if (!res.ok) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Server returned ${res.status}: ${raw}`,
				};
			}

			const contentType = res.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Unexpected content-type: ${contentType}, body: ${raw}`,
				};
			}

			const data = JSON.parse(raw);
			return { data, status: res.status, success: true };
		} catch (error: any) {
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: error.message,
			};
		}
	}

	async sendCompositionByFilters(
		filters: Record<string, any>,
		compositionId: number,
		channelNames: string[],
		subject: string,
		from: string,
		interval: number,
	): Promise<StandardResponse<any>> {
		const session = await auth();
		if (!session) {
			return { data: null, status: 403, success: false };
		}

		try {
			const payload = {
				composition_id: compositionId,
				entity: "contacts",
				searchMask: filters,
				type: "contact",
				channels: channelNames.map((c) => c.toLowerCase()),
				subject,
				from,
				interval,
			};

			console.log(
				">>> Send composition by filters payload:",
				JSON.stringify(payload, null, 2),
			);

			const res = await fetch(
				`${env.CRM_COMPOSER_API_URL}${APIRoutes.COMPOSITION.MASS_SEND}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			const raw = await res.text();
			if (!res.ok) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Server returned ${res.status}: ${raw}`,
				};
			}

			const contentType = res.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				return {
					data: null,
					status: res.status,
					success: false,
					errorMessage: `Unexpected content-type: ${contentType}, body: ${raw}`,
				};
			}

			const data = JSON.parse(raw);
			return { data, status: res.status, success: true };
		} catch (error: any) {
			return {
				data: null,
				status: 500,
				success: false,
				errorMessage: error.message,
			};
		}
	}
	public async getCompositionData(
		page = 1,
		jobsPerPage = 20,
	): Promise<StandardResponse<JobCompositionRecord[]>> {
		const session = await auth();
		if (!session) {
			console.warn("⚠️ No session found");
			return { data: null, status: 403, success: false };
		}

		try {
			const host = env.CRM_COMPOSER_API_URL.replace(/\/+$/, "");

			const listUrl =
				`${host}/admin/queues/api/queues` +
				`?activeQueue=massSendQueue&status=latest` +
				`&page=${page}&jobsPerPage=${jobsPerPage}`;

			const listRes = await fetch(listUrl, {
				cache: "no-store",
				credentials: "include",
				headers: { Accept: "application/json" },
			});
			if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
			const rawText = await listRes.text();

			const contentType = listRes.headers.get("content-type") || "";
			if (!contentType.includes("application/json")) {
				throw new Error("Expected JSON");
			}
			const parsed = JSON.parse(rawText);
			const queues = parsed.queues;
			if (!Array.isArray(queues)) throw new Error("‘queues’ isn’t an array");

			const compQueue = queues.find((q: any) => q.name === "massSendQueue");
			if (!compQueue) {
				return { data: [], status: 200, success: true };
			}

			const jobsRaw = compQueue.jobs;
			if (!Array.isArray(jobsRaw)) throw new Error("‘jobs’ isn’t an array");
			const result: JobCompositionRecord[] = [];
			for (const job of jobsRaw) {
				const logsUrl = `${host}/admin/queues/api/queues/${compQueue.name}/${job.id}/logs`;
				let logsArray: any[] = [];
				try {
					const logsRes = await fetch(logsUrl, {
						cache: "no-store",
						credentials: "include",
						headers: { Accept: "application/json" },
					});
					if (logsRes.ok) {
						const logsJson = await logsRes.json();
						if (Array.isArray(logsJson)) {
							logsArray = logsJson;
						} else if (Array.isArray(logsJson.logs)) {
							logsArray = logsJson.logs;
						}
					} else {
						console.warn(
							`[WARN] Logs fetch for job ${job.id} returned HTTP ${logsRes.status}`,
						);
					}
				} catch (err) {
					console.error(`[ERROR] Failed to fetch logs for job ${job.id}:`, err);
				}

				const logsFailures = logsArray
					.map((l: any) =>
						typeof l === "string"
							? l
							: l.message
								? `${new Date(
										l.timestamp ?? job.timestamp,
									).toLocaleString()}: ${l.message}`
								: JSON.stringify(l),
					)
					.join("\n");

				const { data, composition } = job.data;
				const items = Array.isArray(composition.composition_items)
					? composition.composition_items
					: [];

				result.push({
					id: job.id,
					name: composition.name ?? job.id,
					createdAt: new Date(job.timestamp).toISOString(),
					status: job.finishedOn
						? "completed"
						: job.processedOn
							? "active"
							: "waiting",
					type: data.type,
					progressPercent: job.progress ?? 0,
					jobId: job.id,
					channels: data.channels,
					result: items.map((i: any) => i.result).join("\n"),
					composition_id: composition.id,
					from: data.from,
					title: data.title,
					to: data.to,
					subject: data.subject,
					publicationDate: items[0]?.publication_date ?? null,
					logs: logsFailures,
				});
			}

			return { data: result, status: 200, success: true };
		} catch (error: any) {
			console.error("Error in getCompositionData:", error);
			const m = /HTTP\s+(\d{3})/.exec(error.message);
			return {
				data: null,
				status: m ? +m[1] : 500,
				success: false,
				errorMessage: error.message,
			};
		}
	}
	/**
	 * Duplicates a composition by its ID.
	 * @param {number} compositionId - The ID of the composition to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - The response from the API.
	 */
	async duplicate(compositionId: number): Promise<StandardResponse<null>> {
		const session = await auth();
		if (!session) {
			console.log("No session found");
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		try {
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.COMPOSITIONS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: compositionId }), // Make sure to send as { id: ... }
			});

			const result = await response.json();

			return {
				data: result.responseObject ?? null,
				status: result.status ?? 200,
				success: result.success ?? true,
				errorMessage: result.message,
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
}

const composerService = ComposerService.getInstance();
export default composerService;

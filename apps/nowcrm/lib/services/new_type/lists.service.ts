import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { Form_List, List } from "@/lib/types/new_type/list";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import type { StandardResponse } from "../common/response.service";

class ListsService extends BaseService<List, Form_List> {
	private static instance: ListsService;

	private constructor() {
		super(APIRoutes.LISTS);
	}

	/**
	 * Retrieves the singleton instance of ListsService.
	 * @returns {ListsService} - The singleton instance.
	 */
	public static getInstance(): ListsService {
		if (!ListsService.instance) {
			ListsService.instance = new ListsService();
		}
		return ListsService.instance;
	}

	async countContacts(id: number): Promise<StandardResponse<number>> {
		const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}/${id}/${APIRoutes.LISTS_COUNT_CONTACTS}`;
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}
		try {
			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
			});
			const data = await response.json();

			return {
				data: data.count,
				status: 200,
				success: true,
			};
		} catch (error: any) {
			return {
				data: null,
				status: 401,
				success: false,
				errorMessage: error,
			};
		}
	}

	/**
	 * Duplicates a list by its ID.
	 * @param {number} listId - The ID of the list to duplicate.
	 * @returns {Promise<StandardResponse<null>>} - The response containing the status and any error message.
	 */
	async duplicate(listId: number): Promise<StandardResponse<null>> {
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
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.LISTS_DUPLICATE}`;

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, session.jwt),
				body: JSON.stringify({ id: listId }),
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

const listsService = ListsService.getInstance();
export default listsService;

import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type {
	CompositionItem,
	Form_CompositionItem,
} from "@/lib/types/new_type/composition";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import {
	handleError,
	handleResponse,
	type StandardResponse,
} from "../common/response.service";
import type Asset from "./assets/asset";

class ComposerItemService extends BaseService<
	CompositionItem,
	Form_CompositionItem
> {
	private static instance: ComposerItemService;

	private constructor() {
		super(APIRoutes.COMPOSITIONS_ITEMS);
	}

	/**
	 * Retrieves the singleton instance of ComposerItemService.
	 * @returns {ComposerItemService} - The singleton instance.
	 */
	public static getInstance(): ComposerItemService {
		if (!ComposerItemService.instance) {
			ComposerItemService.instance = new ComposerItemService();
		}
		return ComposerItemService.instance;
	}

	async uploadFile(
		files: any,
		compositionItemId: number,
	): Promise<StandardResponse<Asset[]>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.UPLOAD}`;
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
		formData.append("ref", "api::composition-item.composition-item");
		formData.append("refId", compositionItemId.toString());
		formData.append("field", "attached_files");
		try {
			//TODO: remove config service from here
			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "POST",
				body: formData,
			});
			return await handleResponse(response);
		} catch (error: any) {
			return handleError(error);
		}
	}
}

const composerItemService = ComposerItemService.getInstance();
export default composerItemService;

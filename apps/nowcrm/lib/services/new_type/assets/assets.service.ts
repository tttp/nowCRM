import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import APIRoutes from "../../../http/apiRoutes";
import BaseService from "../../common/base.service";
import {
	handleError,
	handleResponse,
	type StandardResponse,
} from "../../common/response.service";
import type Asset from "./asset";

class AssetsService extends BaseService<Asset, Asset> {
	private static instance: AssetsService;

	private constructor() {
		super(APIRoutes.UPLOAD);
	}

	/**
	 * Retrieves the singleton instance of AssetsService.
	 * @returns {AssetsService} - The singleton instance.
	 */
	public static getInstance(): AssetsService {
		if (!AssetsService.instance) {
			AssetsService.instance = new AssetsService();
		}
		return AssetsService.instance;
	}
	async findAsset(assetId: number): Promise<StandardResponse<Asset>> {
		try {
			const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.UPLOAD}/files/${assetId}`;
			const session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}

			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "Get",
			});

			return await handleResponse(response);
		} catch (error) {
			return handleError(error);
		}
	}

	async upload(formData: FormData): Promise<StandardResponse<Asset[]>> {
		try {
			const url = `${env.CRM_STRAPI_API_URL}${this.endpoint}`;

			const session = await auth();
			if (!session) {
				return {
					data: null,
					status: 403,
					success: false,
				};
			}

			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "POST",
				body: formData,
			});

			return await handleResponse(response);
		} catch (error) {
			return handleError(error);
		}
	}
}

const assetsService = AssetsService.getInstance();
export default assetsService;

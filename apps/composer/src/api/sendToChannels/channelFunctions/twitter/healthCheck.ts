import {
	type SettingCredential,
	settingsCredentialsService,
} from "@nowtec/shared";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { refreshToken } from "./callback";

export async function checkTwitterHealth(
	credential: Omit<SettingCredential, "setting">,
): Promise<ServiceResponse<null> | ServiceResponse<string>> {
	if (!credential || !credential.client_id || !credential.client_secret) {
		settingsCredentialsService.update(
			credential.id,
			{
				status: "disconnected",
				error_message: "Client id or client secret is empty",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
	}

	if (!credential.access_token) {
		settingsCredentialsService.update(
			credential.id,
			{
				status: "disconnected",
				error_message: "Acess token is empty. Please refresh access token",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
	}

	const serviceResponse = await refreshToken(credential);

	if (serviceResponse.success) {
		settingsCredentialsService.update(
			credential.id,
			{
				status: "active",
				error_message: "",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
	}
	return serviceResponse;
}

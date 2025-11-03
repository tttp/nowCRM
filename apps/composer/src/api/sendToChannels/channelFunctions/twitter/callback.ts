import {
	CommunicationChannel,
	type SettingCredential,
	settingsCredentialsService,
	settingsService,
} from "@nowtec/shared";
import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { CALLBACK_URL_TWITTER, env } from "@/common/utils/envConfig";

export async function refreshToken(
	twitter_credential: Omit<SettingCredential, "setting">,
) {
	if (!twitter_credential.refresh_token) {
		await settingsCredentialsService.update(
			twitter_credential.id,
			{
				status: "invalid",
				error_message: "Refresh token is empty please refresh your tokens",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
		return ServiceResponse.failure(
			"Refresh token is empty",
			null,
			StatusCodes.BAD_REQUEST,
		);
	}
	const client = new TwitterApi({
		clientId: twitter_credential.client_id,
		clientSecret: twitter_credential.client_secret,
	});

	try {
		const token = await client.refreshOAuth2Token(
			twitter_credential.refresh_token,
		);

		if (token) {
			await settingsCredentialsService.update(
				twitter_credential.id,
				{
					access_token: token.accessToken,
					refresh_token: token.refreshToken,
					status: "active",
					error_message: "",
				},
				env.COMPOSER_STRAPI_API_TOKEN,
			);

			return ServiceResponse.success(
				"Refreshed token automaticly",
				null,
				StatusCodes.OK,
			);
		}
		return ServiceResponse.failure(
			"Unexpected error",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	} catch (error: any) {
		console.error("Error:", error);
		return ServiceResponse.failure(
			`${error.message}`,
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
}

export async function generateRefreshUrlTwitter() {
	const settings = await settingsService.findOne(
		1,
		env.COMPOSER_STRAPI_API_TOKEN,
		{ populate: "*" },
	);
	if (!settings.success || !settings.data) {
		return ServiceResponse.failure(
			"Setting not found,probably strapi is down",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}

	if (settings.data.setting_credentials.length === 0) {
		return ServiceResponse.failure(
			"Strapi token badly configured for Composer service",
			null,
			StatusCodes.PARTIAL_CONTENT,
		);
	}

	const twitter_credential = settings.data.setting_credentials.find(
		(item) =>
			item.name.toLowerCase() === CommunicationChannel.TWITTER.toLowerCase(),
	);

	if (!twitter_credential) {
		return ServiceResponse.failure(
			"No linkedin credentials found for your account",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}

	if (twitter_credential.refresh_token) {
		return await refreshToken(twitter_credential);
	}

	const client = new TwitterApi({
		clientId: twitter_credential.client_id,
		clientSecret: twitter_credential.client_secret,
	});
	const link = client.generateOAuth2AuthLink(CALLBACK_URL_TWITTER, {
		scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
	});

	await settingsCredentialsService.update(
		twitter_credential.id,
		{
			organization_urn: link.codeVerifier, // here we use organization urn cause its unside field here
		},
		env.COMPOSER_STRAPI_API_TOKEN,
	);

	return ServiceResponse.success(
		"Generated link for refreshing access token",
		link.url,
		StatusCodes.OK,
	);
}

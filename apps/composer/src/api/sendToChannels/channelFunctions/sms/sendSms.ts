import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import {
	CommunicationChannel,
	type CompositionItem,
	type Contact,
	settingsCredentialsService,
	settingsService,
} from "@nowtec/shared";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logEvent } from "../utils/logEvent";
import { checkMentions, replaceMentionsInText } from "../utils/Mentions";

export async function sendMessage(
	contact: Contact,
	composition: CompositionItem,
): Promise<ServiceResponse<string | null>> {
	const settings = await settingsService.findOne(
		1,
		env.COMPOSER_STRAPI_API_TOKEN,
		{ populate: "*" },
	);
	if (!settings.success || !settings.data) {
		return ServiceResponse.failure(
			"Setting not found, probably Strapi is down",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}

	if (settings.data.subscription === "verify") {
		if (contact.subscriptions.length === 0) {
			return ServiceResponse.failure(
				"Contact has no subscription",
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		const smsSubscription = contact.subscriptions?.find((item) =>
			item.channel.name
				.toLowerCase()
				.includes(CommunicationChannel.SMS.toLowerCase()),
		);

		if (!smsSubscription) {
			return ServiceResponse.failure(
				"Contact has no SMS subscription",
				null,
				StatusCodes.BAD_REQUEST,
			);
		}

		if (!smsSubscription.active) {
			return ServiceResponse.failure(
				"Contact subscription is not active",
				null,
				StatusCodes.BAD_REQUEST,
			);
		}
	}

	if (settings.data.setting_credentials.length === 0) {
		return ServiceResponse.failure(
			"Strapi token badly configured for Composer service",
			null,
			StatusCodes.PARTIAL_CONTENT,
		);
	}

	const smsCredential = settings.data.setting_credentials.find(
		(item) =>
			item.name.toLowerCase() === CommunicationChannel.SMS.toLowerCase(),
	);

	if (!smsCredential) {
		return ServiceResponse.failure(
			"No SNS credentials found for your account",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}

	// Validate that the required SNS credentials exist.
	if (!smsCredential.client_id || !smsCredential.client_secret) {
		await settingsCredentialsService.update(
			smsCredential.id,
			{
				status: "invalid",
				error_message: "SMS client credentials are missing",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
		return ServiceResponse.failure(
			"SMS client credentials are missing",
			null,
			StatusCodes.BAD_REQUEST,
		);
	}

	// Determine the recipient's phone number.
	const phoneNumber = contact.mobile_phone
		? contact.mobile_phone
		: contact.phone;
	if (!phoneNumber) {
		return ServiceResponse.failure(
			"No phone number available for contact",
			null,
			StatusCodes.BAD_REQUEST,
		);
	}

	try {
		// Here, we assume that the organization_urn represents the AWS region.
		const snsClient = new SNSClient({
			region: smsCredential.organization_urn,
			credentials: {
				accessKeyId: smsCredential.client_id,
				secretAccessKey: smsCredential.client_secret,
			},
		});
		const publishCommand = new PublishCommand({
			Message: composition.result,
			PhoneNumber: phoneNumber,
		});

		const response = await snsClient.send(publishCommand);

		await settingsCredentialsService.update(
			smsCredential.id,
			{
				status: "active",
				error_message: "",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);

		return ServiceResponse.success(
			"SNS message sent",
			response.MessageId || "",
			StatusCodes.OK,
		);
	} catch (error: any) {
		await settingsCredentialsService.update(
			smsCredential.id,
			{
				status: "invalid",
				error_message:
					error.message || "Unknown error occurred when sending SNS message",
			},
			env.COMPOSER_STRAPI_API_TOKEN,
		);
		return ServiceResponse.failure(
			error.message || "Unknown error occurred when sending SNS message",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
}

export async function SMSMessage(
	composition: CompositionItem,
	contact: Contact,
): Promise<ServiceResponse<boolean>> {
	// Initialize formated_text with the original composition text
	console.log(composition);
	let formated_text: string = composition.result || "";

	// Extract and replace mentions in formated_text, leaving composition.result unchanged.
	const { mentions } = await checkMentions(formated_text);
	formated_text = await replaceMentionsInText(formated_text, contact, mentions);

	const compositionForEmail = { ...composition, result: formated_text };

	const messageId = await sendMessage(contact, compositionForEmail);

	if (!messageId.responseObject) {
		return ServiceResponse.failure(
			messageId.message,
			false,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
	await logEvent(
		contact,
		composition.id as number,
		composition.channel.id,
		"SMS",
		messageId.responseObject,
	);
	return ServiceResponse.success("Message sent", true, StatusCodes.OK);
}

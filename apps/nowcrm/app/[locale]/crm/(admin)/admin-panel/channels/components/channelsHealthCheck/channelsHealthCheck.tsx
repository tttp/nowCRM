"use client";

import {
	AlertCircle,
	DollarSign,
	RefreshCw,
	Smartphone,
	Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createSettingCredential } from "@/lib/actions/settings/credentials/createSettingsCredentials";
import { CommunicationChannel } from "@/lib/static/channel-icons";
import type { Settings } from "@/lib/types/new_type/settings";
import { EmailHealthCheck } from "./channels/email";
import { LinkedInHealthCheck } from "./channels/linkedIn";
import { SmsHealthCheck } from "./channels/sms";
import { TelegramHealthCheck } from "./channels/telegram";
import { TwitterHealthCheck } from "./channels/twitter";
import { UnipileHealthCheck } from "./channels/unipile";
import { WhatsAppHealthCheck } from "./channels/whatsapp";
import { WordpressHealthCheck } from "./channels/wordpress";

interface ChannelSettingsFormProps {
	settings: Settings;
}

export function ChannelHealthCheck({ settings }: ChannelSettingsFormProps) {
	const router = useRouter();
	// Use a ref to track if credentials have been created
	const credentialsCreatedRef = useRef(false);

	const t = useTranslations("Admin.Channels");

	const handleRunHealthCheck = async () => {
		const { runHealthCheck } = await import(
			"@/lib/actions/healthCheck/runHealthCheck"
		);
		const { default: toast } = await import("react-hot-toast");
		await runHealthCheck();
		toast.success(t("common.healthCheck"));
		router.refresh();
	};

	const findCredentialByChannel = (channelName: string) => {
		return settings.setting_credentials.find(
			(credential) =>
				credential.name.toLowerCase() === channelName.toLowerCase(),
		);
	};

	const emailCredential = findCredentialByChannel(CommunicationChannel.EMAIL);
	const linkedInCredential = findCredentialByChannel(
		CommunicationChannel.LINKEDIN,
	);
	const whatsAppCredential = findCredentialByChannel(
		CommunicationChannel.WHATSAPP,
	);
	const smsCredential = findCredentialByChannel(CommunicationChannel.SMS);

	const twitterCredential = findCredentialByChannel(
		CommunicationChannel.TWITTER,
	);

	const telegramCredential = findCredentialByChannel(
		CommunicationChannel.TELEGRAM,
	);

	const wordpressCredential = findCredentialByChannel(
		CommunicationChannel.BLOG,
	);

	const unipileCredential = findCredentialByChannel(
		CommunicationChannel.UNIPILE,
	);

	// useEffect to create missing credentials when the component mounts.
	useEffect(() => {
		// Only run once during the component's lifetime
		if (credentialsCreatedRef.current) {
			return;
		}

		async function createMissingCredentials() {
			try {
				// Set the ref to true immediately to prevent any possibility of duplicate calls
				credentialsCreatedRef.current = true;

				let credentialsCreated = false;

				if (!linkedInCredential) {
					await createSettingCredential(
						CommunicationChannel.LINKEDIN.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!smsCredential) {
					await createSettingCredential(
						CommunicationChannel.SMS.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!whatsAppCredential) {
					await createSettingCredential(
						CommunicationChannel.WHATSAPP.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!twitterCredential) {
					await createSettingCredential(
						CommunicationChannel.TWITTER.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!telegramCredential) {
					await createSettingCredential(
						CommunicationChannel.TELEGRAM.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!wordpressCredential) {
					await createSettingCredential(
						CommunicationChannel.BLOG.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				if (!unipileCredential) {
					await createSettingCredential(
						CommunicationChannel.UNIPILE.toLowerCase(),
						settings.id,
					);
					credentialsCreated = true;
				}

				// Only refresh if we actually created something
				if (credentialsCreated) {
					router.refresh();
				}
			} catch (error) {
				console.error("Error creating credentials:", error);
			}
		}

		createMissingCredentials();
	}, [linkedInCredential, whatsAppCredential, settings.id, router]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t("metaTitle")}</CardTitle>
						<CardDescription>{t("metaDescription")}</CardDescription>
					</div>
					<Button
						onClick={handleRunHealthCheck}
						className="flex cursor-pointer items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						{t("common.runHealthCheck")}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{emailCredential && (
						<EmailHealthCheck email_credential={emailCredential} />
					)}
					{linkedInCredential && (
						<LinkedInHealthCheck linkedin_credential={linkedInCredential} />
					)}
					{whatsAppCredential && (
						<WhatsAppHealthCheck whatsapp_credential={whatsAppCredential} />
					)}
					{smsCredential && <SmsHealthCheck sns_credential={smsCredential} />}
					{twitterCredential && (
						<TwitterHealthCheck twitter_credential={twitterCredential} />
					)}
					{telegramCredential && (
						<TelegramHealthCheck telegram_credential={telegramCredential} />
					)}
					{wordpressCredential && (
						<WordpressHealthCheck wordpress_credential={wordpressCredential} />
					)}
					{unipileCredential && (
						<UnipileHealthCheck unipile_credential={unipileCredential} />
					)}
				</div>
			</CardContent>
			<CardFooter className="mt-2 border-gray-200 border-t pt-4 dark:border-gray-800">
				<div className="w-full space-y-4">
					<div className="flex flex-col space-y-2">
						<h3 className="font-medium text-sm">
							{t("setup_info.setup_title")}
						</h3>
						<div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
							<Tag className="h-4 w-4 flex-shrink-0" />
							<span>{t("setup_info.default_email")}</span>
						</div>
						<div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
							<Smartphone className="h-4 w-4 flex-shrink-0" />
							<span>{t("setup_info.info")}</span>
						</div>
					</div>
					<div className="flex flex-col space-y-2">
						<h3 className="font-medium text-sm">
							{t("setup_info.pricing_title")}
						</h3>
						<div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
							<DollarSign className="h-4 w-4 flex-shrink-0" />
							<span>{t("email.tooltip.price")}</span>
						</div>
						<div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
							<AlertCircle className="h-4 w-4 flex-shrink-0" />
							<span>{t("email.tooltip.limits")}</span>
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}

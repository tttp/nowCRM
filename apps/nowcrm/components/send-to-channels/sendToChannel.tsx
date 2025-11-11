"use client";

import { Mail } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CommunicationChannel } from "@/lib/static/channel-icons";
import { EmailChannelContent } from "./content/email-channel-content";
import { LinkedInChannelContent } from "./content/linkedin-channel-content";
import { LinkedinInvitesChannelContent } from "./content/linkedin-invitations-channel-content";
import { SMSChannelContent } from "./content/sms-channel-content";
import { TelegramChannelContent } from "./content/telegram-channel-content";
import { TwitterChannelContent } from "./content/twitter-channel-content";
import { WhatsAppChannelContent } from "./content/whatsapp-channel-content";
import { WordpressChannelContent } from "./content/wordpress-channel-content";
import { DocumentId } from "@nowcrm/services";

interface SendToChannelsProps {
	channelName: string;
	composition_id: DocumentId;
}

export default function SendToChannelButton({
	composition_id,
	channelName,
}: SendToChannelsProps) {
	const normalizedChannelName = channelName.toLowerCase();

	// Determine if button should be disabled based on channel name
	const isDisabled = ![
		CommunicationChannel.EMAIL.toLowerCase(),
		CommunicationChannel.LINKEDIN.toLowerCase(),
		CommunicationChannel.WHATSAPP.toLowerCase(),
		CommunicationChannel.SMS.toLowerCase(),
		CommunicationChannel.TWITTER.toLowerCase(),
		CommunicationChannel.TELEGRAM.toLowerCase(),
		CommunicationChannel.BLOG.toLowerCase(),
		CommunicationChannel.LINKEDIN_INVTITATIONS.toLowerCase(),
	].includes(normalizedChannelName);
	const [openDialog, setOpenDialog] = React.useState(false);

	// Render the appropriate channel content based on the channel name
	const renderChannelContent = () => {
		switch (normalizedChannelName) {
			case CommunicationChannel.EMAIL.toLowerCase():
				return (
					<EmailChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
						mode="composer"
					/>
				);
			case CommunicationChannel.LINKEDIN.toLowerCase():
				return (
					<LinkedInChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
					/>
				);
			case CommunicationChannel.WHATSAPP.toLowerCase():
				return (
					<WhatsAppChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
						mode="composer"
					/>
				);
			case CommunicationChannel.SMS.toLowerCase():
				return (
					<SMSChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
						mode="composer"
					/>
				);
			case CommunicationChannel.TELEGRAM.toLowerCase():
				return (
					<TelegramChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
					/>
				);
			case CommunicationChannel.TWITTER.toLowerCase():
				return (
					<TwitterChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
					/>
				);
			case CommunicationChannel.BLOG.toLowerCase():
				return (
					<WordpressChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
					/>
				);

			case CommunicationChannel.LINKEDIN_INVTITATIONS.toLowerCase():
				return (
					<LinkedinInvitesChannelContent
						composition_id={composition_id}
						closeOnSubmit={() => setOpenDialog(false)}
					/>
				);
			default:
				return <div>Unsupported channel type</div>;
		}
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild disabled={isDisabled}>
				<Button variant="outline" size="sm" className="ml-4">
					<Mail className="mr-2 h-4 w-4" />
					Send - {channelName}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Send to channel - {channelName}</DialogTitle>
				</DialogHeader>
				{renderChannelContent()}
			</DialogContent>
		</Dialog>
	);
}

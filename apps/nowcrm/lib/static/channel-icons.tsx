import {
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	MessageCircle,
	MessageSquare,
	Send,
} from "lucide-react";
import { FaWordpress } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export enum CommunicationChannel {
	EMAIL = "Email",
	SMS = "SMS",
	LINKEDIN = "LinkedIn",
	WHATSAPP = "WhatsApp",
	// INSTAGRAM = "Instagram",
	TELEGRAM = "Telegram",
	TWITTER = "Twitter",
	UNIPILE = "Unipile", // config for linkedin p2p channels
	// LINKEDIN_MESSAGING = "Linkedin_Messaging",
	LINKEDIN_INVTITATIONS = "Linkedin_Invitations",
	// FACEBOOK = "Facebook",
	BLOG = "Blog",
}

export const CHANNEL_ICONS = {
	email: Mail,
	sms: MessageSquare,
	linkedin: Linkedin,
	whatsapp: MessageCircle,
	instagram: Instagram,
	telegram: Send,
	twitter: FaXTwitter,
	linkedin_invitations: Linkedin,
	facebook: Facebook,
	blog: FaWordpress,
};

// Helper function to get icon by channel name
export const getChannelIcon = (channelName: string) => {
	const normalizedName = channelName.toLowerCase();
	return CHANNEL_ICONS[normalizedName as keyof typeof CHANNEL_ICONS] || Mail; // Default to Mail if not found
};

"use client";

import type React from "react";
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterShareButton,
	ViberIcon,
	ViberShareButton,
	WhatsappIcon,
	WhatsappShareButton,
	XIcon,
} from "react-share";

interface ShareSocialProps {
	url: string;
	title: string;
	hashtag?: string;
}

const ShareSocial: React.FC<ShareSocialProps> = ({ title, url, hashtag }) => {
	const size = 40;

	return (
		<div className="mt-6 space-y-4">
			<div className="flex justify-center">
				<h4 className="font-medium text-lg">Share</h4>
			</div>
			<div className="flex flex-wrap justify-center gap-2">
				<EmailShareButton title={title} url={url} subject={title}>
					<EmailIcon size={size} round />
				</EmailShareButton>

				<FacebookShareButton hashtag={hashtag} title={title} url={url}>
					<FacebookIcon size={size} round />
				</FacebookShareButton>

				<LinkedinShareButton title={title} url={url}>
					<LinkedinIcon size={size} round />
				</LinkedinShareButton>

				<WhatsappShareButton title={title} url={url}>
					<WhatsappIcon size={size} round />
				</WhatsappShareButton>

				<TwitterShareButton
					title={title}
					url={url}
					hashtags={[hashtag || "NOWTEC"]}
				>
					<XIcon size={size} round />
				</TwitterShareButton>

				<TelegramShareButton title={title} url={url}>
					<TelegramIcon size={size} round />
				</TelegramShareButton>

				<ViberShareButton title={title} url={url}>
					<ViberIcon size={size} round />
				</ViberShareButton>
			</div>
		</div>
	);
};

export default ShareSocial;

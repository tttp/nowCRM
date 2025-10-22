// components/ChannelSelect.tsx
"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Reuse the same channel categories data
const channelCategories = [
	{
		name: "P2P",
		description: "Person-to-person communication channels",
		channels: [
			{ value: "email", label: "Email" },
			{ value: "sms", label: "SMS" },
			{ value: "whatsapp", label: "WhatsApp" },
			{ value: "linkedin-messaging", label: "LinkedIn Messaging" },
			{ value: "linkedin-invitations", label: "LinkedIn Invitations" },
		],
	},
	{
		name: "B2C",
		description: "Business-to-consumer communication channels",
		channels: [
			{ value: "linkedin", label: "LinkedIn" },
			{ value: "twitter", label: "X (Twitter)" },
			{ value: "telegram", label: "Telegram" },
			{ value: "blog", label: "Blog (WordPress)" },
		],
	},
];

type ChannelSelectProps = {
	value: string;
	onChange: (value: string) => void;
};

export function ChannelSelect({ value, onChange }: ChannelSelectProps) {
	return (
		<div className="space-y-2">
			<label className="font-medium text-sm">Channel</label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select channel" />
				</SelectTrigger>
				<SelectContent>
					{channelCategories.map((category) => (
						<div key={category.name}>
							<div className="px-2 py-1.5 font-semibold text-muted-foreground text-xs">
								{category.name}
							</div>
							{category.channels.map((channel) => (
								<SelectItem key={channel.value} value={channel.value}>
									{channel.label}
								</SelectItem>
							))}
							{category !== channelCategories[channelCategories.length - 1] && (
								<div className="my-1 h-px bg-muted" />
							)}
						</div>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

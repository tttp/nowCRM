"use client";

import { Loader2, PlusCircle } from "lucide-react";
import { useMessages } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	CommunicationChannel,
	getChannelIcon,
} from "@/lib/static/channel-icons";

interface AddChannelButtonProps {
	existingChannels: string[];
	onAddChannel: (channel: string) => void;
	isLoading?: boolean;
}

export function AddChannelButton({
	existingChannels,
	onAddChannel,
	isLoading = false,
}: AddChannelButtonProps) {
	const [open, setOpen] = useState(false);
	const t = useMessages().Composer.channelContent;

	// Get all available channels that aren't already added
	const availableChannels = Object.values(CommunicationChannel).filter(
		(channel) =>
			!existingChannels.includes(channel as string) &&
			channel !== CommunicationChannel.UNIPILE,
	);

	const handleAddChannel = (channel: string) => {
		onAddChannel(channel);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="mt-2 w-full justify-start"
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<PlusCircle className="mr-2 h-4 w-4" />
					)}
					{isLoading ? t.addingChannel : t.addChannel}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t.addChannel}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-2 py-4">
					{availableChannels.length > 0 ? (
						availableChannels.map((channel) => {
							const Icon = getChannelIcon(channel.toLowerCase());
							return (
								<Button
									key={channel}
									variant="outline"
									className="w-full justify-start"
									onClick={() => handleAddChannel(channel)}
								>
									<Icon className="mr-2 h-4 w-4" />
									{channel}
								</Button>
							);
						})
					) : (
						<p className="text-center text-muted-foreground">{t.successAdd}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

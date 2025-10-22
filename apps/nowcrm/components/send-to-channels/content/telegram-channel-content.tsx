"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTelegram } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { CommunicationChannel } from "@/lib/static/channel-icons";

export interface TelegramChannelContentProps {
	composition_id: number;
	closeOnSubmit: () => void;
}

export function TelegramChannelContent({
	composition_id,
	closeOnSubmit,
}: TelegramChannelContentProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit() {
		const submissionData = {
			composition_id: composition_id,
			channels: [CommunicationChannel.TELEGRAM.toLowerCase()],
		};
		try {
			setIsLoading(true);
			const { sendToChannelAction } = await import("../sendToChannelAction");
			const answer = await sendToChannelAction(submissionData);

			if (answer.success) {
				toast.success("Telegram content posted successfully");
				closeOnSubmit();
				router.refresh();
			} else {
				toast.error(answer.errorMessage || "Failed to post Telegram content");
			}
		} catch (error) {
			toast.error(
				"An unexpected error occurred while posting Telegram content",
			);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="space-y-4">
			<Alert className="">
				<AlertDescription>
					This action will post content to your connected Telegram channel. This
					action is irreversible.
				</AlertDescription>
			</Alert>

			<DialogClose asChild>
				<Button
					type="button"
					className="w-full"
					onClick={onSubmit}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Spinner size="small" />
							Posting...
						</>
					) : (
						<>
							<FaTelegram className="mr-2 h-4 w-4" />
							Post to Telegram
						</>
					)}
				</Button>
			</DialogClose>
		</div>
	);
}

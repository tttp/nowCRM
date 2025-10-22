"use client";
import { Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import Spinner from "@/components/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { CommunicationChannel } from "@/lib/static/channel-icons";

export interface LinkedInChannelContentProps {
	composition_id: number;
	closeOnSubmit: () => void;
}

export function LinkedInChannelContent({
	composition_id,
	closeOnSubmit,
}: LinkedInChannelContentProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit() {
		const submissionData = {
			composition_id: composition_id,
			channels: [CommunicationChannel.LINKEDIN.toLowerCase()],
		};
		try {
			setIsLoading(true);
			const { sendToChannelAction } = await import("../sendToChannelAction");
			const answer = await sendToChannelAction(submissionData);

			if (answer.success) {
				toast.success("LinkedIn content posted successfully");
				closeOnSubmit();
				router.refresh();
			} else {
				toast.error(answer.errorMessage || "Failed to post LinkedIn content");
			}
		} catch (error) {
			toast.error(
				"An unexpected error occurred while posting LinkedIn content",
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
					This action will post content to your connected LinkedIn channel. This
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
							<Linkedin className="mr-2 h-4 w-4" />
							Post to LinkedIn
						</>
					)}
				</Button>
			</DialogClose>
		</div>
	);
}

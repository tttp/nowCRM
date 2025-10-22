"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaWordpress } from "react-icons/fa";
import { z } from "zod";
import Spinner from "@/components/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommunicationChannel } from "@/lib/static/channel-icons";

export interface WordpressChannelContentProps {
	composition_id: number;
	closeOnSubmit: () => void;
}

const formSchema = z.object({
	subject: z.string().min(1, "Subject is required"),
});

export function WordpressChannelContent({
	composition_id,
	closeOnSubmit,
}: WordpressChannelContentProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subject: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const submissionData = {
			composition_id: composition_id,
			subject: values.subject,
			channels: [CommunicationChannel.BLOG.toLowerCase()],
		};
		try {
			setIsLoading(true);
			const { sendToChannelAction } = await import("../sendToChannelAction");
			const answer = await sendToChannelAction(submissionData);

			if (answer.success) {
				toast.success("Wordpress content posted successfully");
				closeOnSubmit();
				router.refresh();
			} else {
				toast.error(answer.errorMessage || "Failed to post Wordpress content");
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
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="subject"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subject</FormLabel>
								<FormControl>
									<Input placeholder="Enter email subject..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Alert className="">
						<AlertDescription>
							This action will post content to your connected Wordpress Blog.
							This action is irreversible.
						</AlertDescription>
					</Alert>

					<DialogClose asChild>
						<Button
							type="button"
							className="w-full"
							disabled={isLoading}
							onClick={form.handleSubmit(onSubmit)}
						>
							{isLoading ? (
								<>
									<Spinner size="small" />
									Posting...
								</>
							) : (
								<>
									<FaWordpress className="mr-2 h-4 w-4" />
									Post to Wordpress
								</>
							)}
						</Button>
					</DialogClose>
				</form>
			</Form>
		</div>
	);
}

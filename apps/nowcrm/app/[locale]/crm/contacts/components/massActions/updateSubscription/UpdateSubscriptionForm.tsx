"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	channel: z.any().refine((v) => !!v && (!!v.value || !!v.id), {
		message: "Please select a channel.",
	}),
	action: z.enum(["subscribe", "unsubscribe"], {
		required_error: "Please choose an action.",
	}),
});

export type UpdateSubscriptionFormValues = z.infer<typeof formSchema>;

export function UpdateSubscriptionForm({
	selectedOption,
	setSelectedOption,
	onSubmitted,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
	onSubmitted?: (values: UpdateSubscriptionFormValues) => void;
}) {
	const form = useForm<UpdateSubscriptionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			channel: selectedOption ?? null,
			action:
				typeof selectedOption?.isSubscribed === "boolean"
					? selectedOption.isSubscribed
						? "subscribe"
						: "unsubscribe"
					: "unsubscribe",
		},
	});

	const action = form.watch("action");
	const isSubscribed = action === "subscribe";

	function syncParent(v: Partial<UpdateSubscriptionFormValues>) {
		const channel = v.channel ?? form.getValues("channel");
		const actionVal = v.action ?? form.getValues("action");
		setSelectedOption({
			...(channel ?? {}),
			isSubscribed: actionVal === "subscribe",
		});
	}

	function onSubmit(values: UpdateSubscriptionFormValues) {
		// bubble up a clean shape the rest of your app expects
		setSelectedOption({
			...(values.channel ?? {}),
			isSubscribed: values.action === "subscribe",
		});
		onSubmitted?.(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
				<FormField
					control={form.control}
					name="channel"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Select Channel</FormLabel>
							<FormControl>
								<div>
									<AsyncSelect
										serviceName="channelService"
										label="channel"
										presetOption={field.value}
										useFormClear={false}
										onValueChange={(opt) => {
											field.onChange(opt);
											syncParent({ channel: opt });
										}}
									/>
								</div>
							</FormControl>
							<FormDescription>
								Pick the channel the action applies to.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="action"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Select Action</FormLabel>
							<FormControl>
								<div className="flex flex-col gap-2">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												id="action-dropdown"
												variant="outline"
												className="w-full justify-between"
											>
												{isSubscribed ? "Subscribe" : "Unsubscribe"}
												<ChevronDown className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="start" className="w-full">
											<DropdownMenuItem
												onSelect={() => {
													field.onChange("subscribe");
													syncParent({ action: "subscribe" });
												}}
											>
												Subscribe
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => {
													field.onChange("unsubscribe");
													syncParent({ action: "unsubscribe" });
												}}
											>
												Unsubscribe
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									<p className="text-gray-600 text-sm">
										{isSubscribed
											? "⚠️ This action subscribes contacts to the selected channel."
											: "⚠️ This action unsubscribes contacts from the selected channel."}
									</p>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

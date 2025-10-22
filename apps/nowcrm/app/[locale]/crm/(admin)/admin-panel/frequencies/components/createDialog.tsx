"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { GrAddCircle } from "react-icons/gr";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CreateFrequencyDialog() {
	const t = useMessages();
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const formSchema = z.object({
		name: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		const { createFrequency } = await import(
			"@/lib/actions/frequencies/createFrequency"
		);
		const res = await createFrequency(values.name);
		if (!res.success) {
			toast.error(
				`${t.Admin.Frequency.toast.createFrequencyError} ${res.errorMessage}`,
			);
		} else {
			toast.success(
				`${t.Admin.Frequency.toast.frequency} ${values.name} ${t.common.actions.created}`,
			);
			router.refresh();
			setDialogOpen(false);
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="ml-2 hidden h-8 cursor-pointer lg:flex">
					<GrAddCircle className="mr-2 h-4 w-4" />
					{t.common.actions.create}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t.Admin.Frequency.dialog.title}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center">
										<FormLabel>{t.Admin.Frequency.form.label}</FormLabel>
									</div>
									<FormControl>
										<Input
											placeholder={t.Admin.Frequency.form.placeholder}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full cursor-pointer">
							<ListPlus className="mr-2 h-4 w-4" />
							{t.Admin.Frequency.action.createFrequency}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

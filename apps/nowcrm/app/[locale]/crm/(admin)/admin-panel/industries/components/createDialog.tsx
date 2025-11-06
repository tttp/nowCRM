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
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createIndustry } from "@/lib/actions/industries/create-industry";

export default function CreateIndustryDialog() {
	const t = useMessages();

	const router = useRouter();
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const formSchema = z.object({
		name: z.string().min(2, {
			message: t.Admin.Industry.form.industrySchema,
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		const res = await createIndustry(values.name);
		if (!res.success) {
			toast.error(
				`${t.Admin.Industry.toast.createIndustryError}: ${res.errorMessage}`,
			);
		} else {
			toast.success(
				`${t.Admin.Industry.toast.industry} ${values.name} ${t.common.actions.created}`,
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
					<DialogTitle>{t.Admin.Industry.dialog.title}</DialogTitle>
					<DialogDescription>
						{t.Admin.Industry.dialog.description}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t.Admin.Industry.form.label}</FormLabel>
									<FormControl>
										<Input
											placeholder={t.Admin.Industry.form.placeholder}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t.Admin.Industry.form.description}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full cursor-pointer">
							<ListPlus className="mr-2 h-4 w-4" />
							{t.Admin.Industry.action.createIndustry}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

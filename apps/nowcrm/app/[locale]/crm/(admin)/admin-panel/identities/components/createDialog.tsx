"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, ListPlus } from "lucide-react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createIdentity } from "@/lib/actions/identities/createIdentity";

export default function CreateIdentityDialog() {
	const t = useMessages();
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const formSchema = z.object({
		identity: z.string().refine(
			(input) => {
				const trimmed = input.trim();
				if (/^[!,-]/.test(trimmed)) {
					return false;
				}
				const regex = /^([A-Za-z]+(?:\s+[A-Za-z]+)+)\s+<([^<>]+)>$/;
				const match = trimmed.match(regex);

				if (!match) {
					return false;
				}
				const emailPart = match[2].trim();

				try {
					z.string().email().parse(emailPart);
				} catch {
					return false;
				}

				return true;
			},
			{
				message: t.Admin.Identity.form.indentitySchema,
			},
		),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			identity: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		const res = await createIdentity(values.identity);
		if (!res.success) {
			toast.error(
				`${t.Admin.Identity.toast.createIndentityError} ${res.errorMessage}`,
			);
		} else {
			toast.success(
				`${t.Admin.Identity.toast.identity} ${values.identity} ${t.common.actions.created}`,
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
					<DialogTitle>{t.Admin.Identity.dialog.title}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="identity"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center">
										<FormLabel>{t.Admin.Identity.form.label}</FormLabel>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild className="ml-3">
													<div className="cursor-help">
														<HelpCircle className="h-4 w-4 text-muted-foreground" />
													</div>
												</TooltipTrigger>
												<TooltipContent className="w-120 p-2">
													<p className="mb-1 font-medium">
														{t.Admin.Identity.form.tooltipFormat}
													</p>
													<p>{t.Admin.Identity.form.tooltip}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
									<FormControl>
										<Input
											placeholder={t.Admin.Identity.form.placeholder}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full cursor-pointer">
							<ListPlus className="mr-2 h-4 w-4" />
							{t.Admin.Identity.action.createIdentity}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

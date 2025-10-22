"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { GrEdit } from "react-icons/gr";
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
import type { Identity } from "@/lib/types/new_type/identity";

interface EditIdentityDialogProps {
	identity: Identity;
}

export default function EditIdentityDialog({
	identity,
}: EditIdentityDialogProps) {
	const t = useMessages();
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();

	const formSchema = z.object({
		name: z.string().refine(
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
			name: identity.name ?? "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const { default: toast } = await import("react-hot-toast");
		const { updateIdentity } = await import(
			"@/lib/actions/identities/updateIdentity"
		);

		const result = await updateIdentity(identity.id, values);
		setIsLoading(false);

		if (!result.success) {
			toast.error(
				`${t.Admin.Identity.toast.updateIndentityError} ${result.errorMessage}`,
			);
		} else {
			toast.success(
				`${t.Admin.Identity.toast.identity} ${values.name} updated`,
			);
			setDialogOpen(false);
			router.refresh();
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="ml-2 hidden h-8 cursor-pointer lg:flex">
					<GrEdit className="mr-2 h-4 w-4" />
					{t.common.actions.edit}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t.Admin.Identity.dialog.editTitle}</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
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

							<Button
								type="submit"
								className="w-full cursor-pointer"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
										{t.common.status.saving}
									</>
								) : (
									<>
										<ListPlus className="mr-2 h-4 w-4" />
										{t.common.actions.update}
									</>
								)}
							</Button>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}

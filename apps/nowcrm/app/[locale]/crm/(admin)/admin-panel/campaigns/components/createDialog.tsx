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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createCampaign } from "@/lib/actions/campaigns/create-campaign";
import { CampaignCategory } from "@nowcrm/services";
import { campaignCategoriesService } from "@nowcrm/services/server";


export default function CreateCampaignDialog() {
	const t = useMessages();

	const router = useRouter();
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [campaigns, setCampaigns] = React.useState<CampaignCategory[]>([]);

	React.useEffect(() => {
		const fetchCategories = async () => {
			//todo CHANGE CATEGORIES TO ASYNC SELCT
			const response = await campaignCategoriesService.find("", {
				fields: ["id", "name"],
			});
			if (response.success && response.data) {
				setCampaigns(response.data);
			}
		};
		fetchCategories();
	}, []);

	const formSchema = z.object({
		name: z.string().min(2, {
			message: t.Admin.Campaign.form.nameSchema,
		}),
		description: z.string().optional(),
		campaignId: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			campaignId: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		const res = await createCampaign(
			values.name,
			values.description,
			values.campaignId
				? (values.campaignId)
				: undefined,
		);
		if (!res.success) {
			toast.error(`${t.Admin.Campaign.toast.createError}: ${res.errorMessage}`);
		} else {
			toast.success(
				`${t.Admin.Campaign.toast.campaign} ${values.name} ${t.common.actions.created}`,
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
					<DialogTitle>{t.Admin.Campaign.dialog.title}</DialogTitle>
					<DialogDescription>
						{t.Admin.Campaign.dialog.description}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t.Admin.Campaign.form.nameLabel}</FormLabel>
									<FormControl>
										<Input
											placeholder={t.Admin.Campaign.form.namePlaceholder}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t.Admin.Campaign.form.nameDescription}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t.Admin.Campaign.form.descriptionLabel}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t.Admin.Campaign.form.descriptionPlaceholder}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t.Admin.Campaign.form.descriptionDescription}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="campaignId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t.Admin.Campaign.form.categoryLabel}</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														t.Admin.Campaign.form.categoryPlaceholder
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{campaigns.map((campaign) => (
												<SelectItem
													key={campaign.id}
													value={campaign.id.toString()}
												>
													{campaign.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										{t.Admin.Campaign.form.categoryDescription}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full cursor-pointer">
							<ListPlus className="mr-2 h-4 w-4" />
							{t.Admin.Campaign.action.create}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

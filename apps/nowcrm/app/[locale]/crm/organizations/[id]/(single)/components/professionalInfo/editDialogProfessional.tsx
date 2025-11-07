"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AsyncSelectField } from "@/components/autoComplete/asyncSelectField";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { updateOrganization } from "@/lib/actions/organizations/update-organization";
import { Organization } from "@nowcrm/services";

const formSchema = z.object({
	organization_type: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
	frequency: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
	media_type: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
	url: z.string().optional(),
	twitter_url: z.string().optional(),
	facebook_url: z.string().optional(),
	whatsapp_channel: z.string().optional(),
	linkedin_url: z.string().optional(),
	telegram_url: z.string().optional(),
	telegram_channel: z.string().optional(),
	instagram_url: z.string().optional(),
	tiktok_url: z.string().optional(),
	whatsapp_phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDialogOrganizationProfessionalProps {
	organization: Organization;
	isOpen: boolean;
	onClose: () => void;
}

export function EditDialogOrganizationProfessional({
	organization,
	isOpen,
	onClose,
}: EditDialogOrganizationProfessionalProps) {
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			organization_type: organization.organization_type
				? {
						label: organization.organization_type.name,
						value: organization.organization_type.id,
					}
				: undefined,
			frequency: organization.frequency
				? {
						label: organization.frequency.name,
						value: organization.frequency.id,
					}
				: undefined,
			media_type: organization.media_type
				? {
						label: organization.media_type.name,
						value: organization.media_type.id,
					}
				: undefined,
			url: organization.url || "",
			twitter_url: organization.twitter_url || "",
			facebook_url: organization.facebook_url || "",
			whatsapp_channel: organization.whatsapp_channel || "",
			linkedin_url: organization.linkedin_url || "",
			telegram_url: organization.telegram_url || "",
			telegram_channel: organization.telegram_channel || "",
			instagram_url: organization.instagram_url || "",
			tiktok_url: organization.tiktok_url || "",
			whatsapp_phone: organization.whatsapp_phone || "",
		},
	});

	async function handleSubmit(values: FormValues) {
		const res = await updateOrganization(organization.documentId, values as any);
		if (!res.success) {
			toast.error(`Error updating organization: ${res.errorMessage}`);
		} else {
			toast.success("Organization updated");
			router.refresh();
			onClose();
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Professional Information</DialogTitle>
					<DialogDescription>
						Update the organization&apos;s professional details.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<AsyncSelectField
							name="organization_type"
							label="Organization type"
							form={form}
							useFormClear={true}
							serviceName="organizationTypesService"
						/>
						<AsyncSelectField
							name="frequency"
							label="frequency"
							form={form}
							useFormClear={true}
							serviceName="frequenciesService"
						/>
						<AsyncSelectField
							name="media_type"
							label="Media type"
							form={form}
							useFormClear={true}
							serviceName="mediaTypesService"
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Website URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Website URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="linkedin_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>LinkedIn URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="LinkedIn URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="twitter_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Twitter&#40;X&#41; URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Twitter URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="facebook_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Facebook URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Facebook URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="whatsapp_channel"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>WhatsApp Channel</FormLabel>
									<FormControl>
										<Input {...field} placeholder="WhatsApp Channel" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="telegram_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Telegram URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Telegram URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="telegram_channel"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Telegram Channel</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Telegram Channel" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="instagram_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Instagram URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Instagram URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tiktok_url"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>TikTok URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder="TikTok URL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="whatsapp_phone"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>WhatsApp Phone</FormLabel>
									<FormControl>
										<Input {...field} placeholder="WhatsApp Phone" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="pt-4">
							<Button variant="outline" type="button" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

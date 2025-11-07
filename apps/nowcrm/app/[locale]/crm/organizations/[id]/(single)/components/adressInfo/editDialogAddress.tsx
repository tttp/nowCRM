"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
	FaBuilding,
	FaFlag,
	FaHashtag,
	FaMap,
	FaMapMarkerAlt,
} from "react-icons/fa";
import { z } from "zod";
import { SearchableComboboxDialog } from "@/components/SearchableComboboxDialog";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateOrganization } from "@/lib/actions/organizations/update-organization";
import cantons from "@/lib/static/cantons.json";
import countries from "@/lib/static/countries.json";
import { Organization } from "@nowcrm/services";

const formSchema = z.object({
	address_line1: z.string().optional(),
	location: z.string().optional(),
	canton: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDialogOrganizationAddressProps {
	organization: Organization;
	isOpen: boolean;
	onClose: () => void;
}

export function EditDialogOrganizationAddress({
	organization,
	isOpen,
	onClose,
}: EditDialogOrganizationAddressProps) {
	const t = useMessages();

	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address_line1: organization.address_line1 || "",
			location: organization.location || "",
			canton: organization.canton || "",
			zip: organization.zip || "",
			country: organization.country || "",
		},
	});

	const country = form.watch("country");
	useEffect(() => {
		if (country !== "Switzerland") {
			form.setValue("canton", "");
		}
	}, [country]);

	async function handleSubmit(values: FormValues) {
		const finalValues = {
			...values,
			canton: values.country === "Switzerland" ? values.canton || "" : "", // Ignore canton if not CH
			country: values.country || "",
		};
		const res = await updateOrganization(organization.documentId, finalValues);
		if (!res.success) {
			toast.error(`Error updating organization address: ${res.errorMessage}`);
		} else {
			toast.success("Organization address updated");
			router.refresh();
			onClose();
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Address Information</DialogTitle>
					<DialogDescription>
						Update the organization&apos;s address details.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="address_line1"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaBuilding className="mr-2 text-primary" />{" "}
										{t.AdvancedFilters.fields.address_line1}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t.AdvancedFilters.placeholders.address_line}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaMapMarkerAlt className="mr-2 text-primary" />{" "}
										{t.AdvancedFilters.fields.location}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t.AdvancedFilters.placeholders.location}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="canton"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaMap className="mr-2 text-primary" />{" "}
										{t.AdvancedFilters.fields.canton}
									</FormLabel>
									<FormDescription>
										{t.Contacts.details.address.hintCanton}
									</FormDescription>
									<FormControl>
										<SearchableComboboxDialog
											options={cantons}
											value={field.value ?? ""}
											onChange={field.onChange}
											placeholder={t.AdvancedFilters.placeholders.canton}
											disabled={form.watch("country") !== "Switzerland"}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="zip"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaHashtag className="mr-2 text-primary" />{" "}
										{t.AdvancedFilters.fields.zip}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t.AdvancedFilters.fields.zip}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaFlag className="mr-2 text-primary" />{" "}
										{t.AdvancedFilters.fields.country}
									</FormLabel>
									<FormControl>
										<SearchableComboboxDialog
											options={countries}
											value={field.value ?? ""}
											onChange={field.onChange}
											placeholder={t.AdvancedFilters.placeholders.country}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="pt-4">
							<Button variant="outline" type="button" onClick={onClose}>
								{t.common.actions.cancel}
							</Button>
							<Button type="submit">{t.common.actions.saveChanges} </Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

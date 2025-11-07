"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AsyncSelectField } from "@/components/autoComplete/asyncSelectField";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	parseFormIntoUrlFilters,
	parseQueryToFilterValues,
} from "@/lib/actions/filters/filters-search";

import {
	NUMBER_OPERATORS,
	type Operator,
	TEXT_OPERATORS,
} from "@nowcrm/services";

const FIELD_TYPES: Record<string, "text" | "number"> = {
	name: "text",
	email: "text",
	url: "text",
	address_line1: "text",
	contact_person: "text",
	location: "text",
	country: "text",
	zip: "number",
	canton: "text",
	twitter_url: "text",
	facebook_url: "text",
	whatsapp_channel: "text",
	linkedin_url: "text",
	telegram_url: "text",
	telegram_channel: "text",
	instagram_url: "text",
	tiktok_url: "text",
	whatsapp_phone: "text",
};

function getOperatorsForField(field: string): Operator[] {
	return FIELD_TYPES[field] === "number" ? NUMBER_OPERATORS : TEXT_OPERATORS;
}

function OperatorSelect({
	fieldName,
	value,
	onChange,
}: {
	fieldName: keyof FilterValues;
	value?: string;
	onChange: (v: string) => void;
}) {
	const ops = getOperatorsForField(fieldName as string);
	return (
		<Select value={value || ops[0].value} onValueChange={onChange}>
			<SelectTrigger className="w-[100px]">
				<SelectValue placeholder="Op" />
			</SelectTrigger>
			<SelectContent>
				{ops.map((o) => (
					<SelectItem key={o.value} value={o.value}>
						{o.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

// --- Schema and types ---
const filterSchema = z.object({
	// General Information
	name: z.string().optional(),
	name_operator: z.string().optional(),
	email: z.string().optional(),
	email_operator: z.string().optional(),
	url: z.string().optional(),
	url_operator: z.string().optional(),

	// Address Information
	address_line1: z.string().optional(),
	address_line1_operator: z.string().optional(),
	contact_person: z.string().optional(),
	contact_person_operator: z.string().optional(),
	location: z.string().optional(),
	location_operator: z.string().optional(),
	country: z.string().optional(),
	country_operator: z.string().optional(),
	zip: z.string().optional(),
	zip_operator: z.string().optional(),
	county_operator: z.string().optional(),
	canton: z.string().optional(),
	canton_operator: z.string().optional(),

	// Social Media
	twitter_url: z.string().optional(),
	twitter_url_operator: z.string().optional(),
	facebook_url: z.string().optional(),
	facebook_url_operator: z.string().optional(),
	whatsapp_channel: z.string().optional(),
	whatsapp_channel_operator: z.string().optional(),
	linkedin_url: z.string().optional(),
	linkedin_url_operator: z.string().optional(),
	telegram_url: z.string().optional(),
	telegram_url_operator: z.string().optional(),
	telegram_channel: z.string().optional(),
	telegram_channel_operator: z.string().optional(),
	instagram_url: z.string().optional(),
	instagram_url_operator: z.string().optional(),
	tiktok_url: z.string().optional(),
	tiktok_url_operator: z.string().optional(),
	whatsapp_phone: z.string().optional(),
	whatsapp_phone_operator: z.string().optional(),

	// Organization and Contacts
	contacts: z.object({ value: z.number(), label: z.string() }).optional(),
	organization_type: z
		.object({ value: z.number(), label: z.string() })
		.optional(),
	industry: z.object({ value: z.number(), label: z.string() }).optional(),

	// Preferences / Other
	frequency: z.object({ value: z.number(), label: z.string() }).optional(),
	media_type: z.object({ value: z.number(), label: z.string() }).optional(),
	language: z.string().optional(),
	tag: z.string().optional(),
	tag_operator: z.string().optional(),
	description: z.string().optional(),
	description_operator: z.string().optional(),
	sources: z.object({ value: z.number(), label: z.string() }).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

function getActiveCount(
	keys: (keyof FilterValues)[],
	values: FilterValues,
): number {
	return keys.filter((k) => {
		const v = values[k];
		return v !== undefined && v !== "";
	}).length;
}

function FilterSection({
	title,
	activeCount,
	children,
}: {
	title: string;
	activeCount: number;
	children: React.ReactNode;
}) {
	return (
		<details className="mb-4 rounded border">
			<summary className="cursor-pointer p-4 font-medium">
				{title} <span className="text-sm">({activeCount})</span>
			</summary>
			<div className="p-4">{children}</div>
		</details>
	);
}

// --- Component ---
export default function AdvancedFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [open, setOpen] = React.useState(false);

	const defaultValues = React.useMemo(
		() => parseQueryToFilterValues<FilterValues>(searchParams),
		[searchParams],
	);

	const form = useForm<FilterValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: defaultValues ?? {},
	});

	const values = form.watch();

	const generalFields: (keyof FilterValues)[] = ["name", "email", "url"];
	const addressFields: (keyof FilterValues)[] = [
		"address_line1",
		"contact_person",
		"location",
		"country",
		"zip",
		"canton",
	];
	const socialFields: (keyof FilterValues)[] = [
		"twitter_url",
		"facebook_url",
		"whatsapp_channel",
		"linkedin_url",
		"telegram_url",
		"telegram_channel",
		"instagram_url",
		"tiktok_url",
		"whatsapp_phone",
	];
	const organizationFields: (keyof FilterValues)[] = [
		"contacts",
		"organization_type",
		"industry",
	];
	const preferencesFields: (keyof FilterValues)[] = [
		"frequency",
		"media_type",
		"language",
		"tag",
		"description",
		"sources",
	];

	function onSubmit(vals: FilterValues) {
		const qs = parseFormIntoUrlFilters(vals);
		router.push(`?${qs}`);
		setOpen(false);
	}

	function handleReset() {
		form.reset({});
		router.push("?page=1");
		setOpen(false);
	}

	const hasActiveFilters = Object.entries(values).some(
		([_, value]) =>
			value !== undefined &&
			value !== null &&
			value !== "" &&
			!(typeof value === "object" && Object.keys(value).length === 0),
	);

	return (
		<div className="ml-1">
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					{/* Responsive filter button */}
					<Button
						variant="outline"
						className="relative flex items-center bg-card text-muted-foreground hover:border-accent-foreground/25 hover:bg-accent"
					>
						{/* Icon only on small screens */}
						<span className="block md:hidden">
							<Filter className="h-5 w-5" />
							{hasActiveFilters && (
								<span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
							)}
						</span>
						{/* Text only on medium+ screens */}
						<span className="hidden md:inline">Advanced Filters</span>
					</Button>
				</DrawerTrigger>
				<DrawerContent className="flex h-[95vh] flex-col">
					<DrawerHeader>
						<DrawerTitle>Advanced Filters</DrawerTitle>
						<DrawerDescription>
							Apply advanced filters to refine your search
						</DrawerDescription>
					</DrawerHeader>
					<div className="flex-1 overflow-y-auto px-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								{/* General Information */}
								<FilterSection
									title="General Information"
									activeCount={getActiveCount(generalFields, values)}
								>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{/* Name */}
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Name</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="name"
															value={form.watch("name_operator")}
															onChange={(v) =>
																form.setValue("name_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter name" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Email */}
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Email</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="email"
															value={form.watch("email_operator")}
															onChange={(v) =>
																form.setValue("email_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter email" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* URL */}
										<FormField
											control={form.control}
											name="url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Website URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="url"
															value={form.watch("url_operator")}
															onChange={(v) => form.setValue("url_operator", v)}
														/>
														<FormControl>
															<Input placeholder="Enter URL" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</FilterSection>

								{/* Address Information */}
								<FilterSection
									title="Address Information"
									activeCount={getActiveCount(addressFields, values)}
								>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{/* Address Line 1 */}
										<FormField
											control={form.control}
											name="address_line1"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Address Line 1</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="address_line1"
															value={form.watch("address_line1_operator")}
															onChange={(v) =>
																form.setValue("address_line1_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter address" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Contact Person */}
										<FormField
											control={form.control}
											name="contact_person"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Contact Person</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="contact_person"
															value={form.watch("contact_person_operator")}
															onChange={(v) =>
																form.setValue("contact_person_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter contact person"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Location */}
										<FormField
											control={form.control}
											name="location"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Location</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="location"
															value={form.watch("location_operator")}
															onChange={(v) =>
																form.setValue("location_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter location" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Country */}
										<FormField
											control={form.control}
											name="country"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Country</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="country"
															value={form.watch("country_operator")}
															onChange={(v) =>
																form.setValue("country_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter country" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* ZIP */}
										<FormField
											control={form.control}
											name="zip"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>ZIP</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="zip"
															value={form.watch("zip_operator")}
															onChange={(v) => form.setValue("zip_operator", v)}
														/>
														<FormControl>
															<Input placeholder="Enter ZIP code" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Canton */}
										<FormField
											control={form.control}
											name="canton"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Canton</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="canton"
															value={form.watch("canton_operator")}
															onChange={(v) =>
																form.setValue("canton_operator", v)
															}
														/>
														<FormControl>
															<Input placeholder="Enter canton" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</FilterSection>

								{/* Social Media */}
								<FilterSection
									title="Social Media"
									activeCount={getActiveCount(socialFields, values)}
								>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{/* Twitter */}
										<FormField
											control={form.control}
											name="twitter_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Twitter (X) URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="twitter_url"
															value={form.watch("twitter_url_operator")}
															onChange={(v) =>
																form.setValue("twitter_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter Twitter URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Facebook */}
										<FormField
											control={form.control}
											name="facebook_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Facebook URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="facebook_url"
															value={form.watch("facebook_url_operator")}
															onChange={(v) =>
																form.setValue("facebook_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter Facebook URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* WhatsApp Channel */}
										<FormField
											control={form.control}
											name="whatsapp_channel"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>WhatsApp Channel</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="whatsapp_channel"
															value={form.watch("whatsapp_channel_operator")}
															onChange={(v) =>
																form.setValue("whatsapp_channel_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter WhatsApp Channel"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* LinkedIn */}
										<FormField
											control={form.control}
											name="linkedin_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>LinkedIn URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="linkedin_url"
															value={form.watch("linkedin_url_operator")}
															onChange={(v) =>
																form.setValue("linkedin_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter LinkedIn URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Telegram URL */}
										<FormField
											control={form.control}
											name="telegram_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Telegram URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="telegram_url"
															value={form.watch("telegram_url_operator")}
															onChange={(v) =>
																form.setValue("telegram_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter Telegram URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Telegram Channel */}
										<FormField
											control={form.control}
											name="telegram_channel"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Telegram Channel</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="telegram_channel"
															value={form.watch("telegram_channel_operator")}
															onChange={(v) =>
																form.setValue("telegram_channel_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter Telegram Channel"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Instagram */}
										<FormField
											control={form.control}
											name="instagram_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Instagram URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="instagram_url"
															value={form.watch("instagram_url_operator")}
															onChange={(v) =>
																form.setValue("instagram_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter Instagram URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* TikTok */}
										<FormField
											control={form.control}
											name="tiktok_url"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>TikTok URL</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="tiktok_url"
															value={form.watch("tiktok_url_operator")}
															onChange={(v) =>
																form.setValue("tiktok_url_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter TikTok URL"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* WhatsApp Phone */}
										<FormField
											control={form.control}
											name="whatsapp_phone"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>WhatsApp Phone</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="whatsapp_phone"
															value={form.watch("whatsapp_phone_operator")}
															onChange={(v) =>
																form.setValue("whatsapp_phone_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter WhatsApp Phone"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</FilterSection>

								{/* Organization and Contacts */}
								<FilterSection
									title="Organization and Contacts"
									activeCount={getActiveCount(organizationFields, values)}
								>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										{/* <AsyncSelectField
                      form={form}
                      name="contacts"
                      serviceName="contactService"
                      label="Contacts"
                      useFormClear={true}
                    /> */}
										<AsyncSelectField
											form={form}
											name="organization_type"
											serviceName="organizationTypesService"
											label="Organization Type"
											useFormClear={true}
										/>
										<AsyncSelectField
											form={form}
											name="industry"
											serviceName="industriesService"
											label="Industry"
											useFormClear={true}
										/>
									</div>
								</FilterSection>

								{/* Preferences / Other */}
								<FilterSection
									title="Preferences / Other"
									activeCount={getActiveCount(preferencesFields, values)}
								>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<AsyncSelectField
											form={form}
											name="frequency"
											serviceName="frequenciesService"
											label="Frequency"
											useFormClear={true}
										/>
										<AsyncSelectField
											form={form}
											name="media_type"
											serviceName="mediaTypesService"
											label="Media Type"
											useFormClear={true}
										/>
										{/* Language (no operator) */}
										<FormField
											control={form.control}
											name="language"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Language</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger>
																<SelectValue placeholder="Select language" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="en">English</SelectItem>
																<SelectItem value="de">Deutsch</SelectItem>
																<SelectItem value="fr">Français</SelectItem>
																<SelectItem value="it">Italiano</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Tag */}
										<FormField
											control={form.control}
											name="tag"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Tag</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="tag"
															value={form.watch("tag_operator")}
															onChange={(v) => form.setValue("tag_operator", v)}
														/>
														<FormControl>
															<Input placeholder="Enter tag" {...field} />
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* Description */}
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Description</FormLabel>
													<div className="flex items-center gap-2">
														<OperatorSelect
															fieldName="description"
															value={form.watch("description_operator")}
															onChange={(v) =>
																form.setValue("description_operator", v)
															}
														/>
														<FormControl>
															<Input
																placeholder="Enter description"
																{...field}
															/>
														</FormControl>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										<AsyncSelectField
											form={form}
											name="sources"
											serviceName="sourcesService"
											label="Sources"
											useFormClear={true}
										/>
									</div>
								</FilterSection>
							</form>
						</Form>
					</div>

					<DrawerFooter>
						<div className="flex items-center justify-between">
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
							<div className="flex gap-2">
								<Button onClick={form.handleSubmit(onSubmit)}>
									Apply Filters
								</Button>
								<Button variant="outline" onClick={handleReset}>
									Reset Filters
								</Button>
							</div>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

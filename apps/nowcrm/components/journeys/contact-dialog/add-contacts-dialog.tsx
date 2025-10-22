"use client";

import { Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface SendToChannelsProps {
	step_id: number;
	refreshData: () => void;
}

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { AsyncSelectField } from "@/components/autoComplete/asyncSelectField";
import Spinner from "@/components/Spinner";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface addContactsToStepData {
	step_id: number;
	contacts?: number | number[] | string | string[];
	type?: "list" | "contact" | "organization";
}

// Combined schema with all fields as optional
const formSchema = z.object({
	email: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
	list: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
	organization: z
		.object({
			value: z.number(),
			label: z.string(),
		})
		.optional(),
});

export default function AddContactsToStepDialog({
	step_id,
	refreshData,
}: SendToChannelsProps) {
	const [openDialog, setOpenDialog] = React.useState(false);

	const [activeTab, setActiveTab] = useState("list");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: undefined,
			list: undefined,
			organization: undefined,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Only process values from the active tab
		let submissionData: addContactsToStepData | undefined;
		let isValid = true;
		console.log(values);
		if (activeTab === "contact") {
			if (!values.email) {
				toast.error("Email is required");
				isValid = false;
			} else {
				submissionData = {
					step_id: step_id,
					contacts: values.email.value,
					type: "contact",
				};
			}
		} else if (activeTab === "list") {
			if (!values.list) {
				toast.error("List is required");
				isValid = false;
			} else {
				submissionData = {
					step_id: step_id,
					contacts: values.list.value,
					type: "list",
				};
			}
		} else if (activeTab === "organization") {
			if (!values.organization) {
				toast.error("Organization is required");
				isValid = false;
			} else {
				submissionData = {
					step_id: step_id,
					contacts: values.organization.value,
					type: "organization",
				};
			}
		}

		if (isValid && submissionData) {
			try {
				setIsLoading(true);
				const { addToStepAction } = await import("./addToStepContacts");
				const answer = await addToStepAction(submissionData);

				if (answer.success) {
					toast.success("Contacts added");
					setOpenDialog(false);
				} else {
					toast.error(answer.errorMessage || "Failed to add contacts");
				}
			} catch (error) {
				toast.error("An error occurred while adding contacts");
				console.error(error);
			} finally {
				setIsLoading(false);
				refreshData();
			}
		}
	}

	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="ml-4">
					<Contact className="mr-2 h-4 w-4" />
					Add contacts to step
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add contacts to step</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Tabs
							defaultValue="list"
							className="w-full"
							onValueChange={handleTabChange}
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="contact">Contact</TabsTrigger>
								<TabsTrigger value="list">List</TabsTrigger>
								<TabsTrigger value="organization">Organization</TabsTrigger>
							</TabsList>

							<TabsContent value="contact" className="pt-4">
								<AsyncSelectField
									name="email"
									filterKey="email"
									label="Contact"
									serviceName="contactService"
									form={form}
									useFormClear={false}
								/>
							</TabsContent>

							<TabsContent value="list" className="pt-4">
								<AsyncSelectField
									name="list"
									label="List"
									serviceName="listService"
									form={form}
									useFormClear={false}
								/>
							</TabsContent>

							<TabsContent value="organization" className="pt-4">
								<AsyncSelectField
									name="organization"
									label="Organization"
									serviceName="organizationService"
									form={form}
									useFormClear={false}
								/>
							</TabsContent>
						</Tabs>

						<DialogClose asChild>
							<Button
								type="button"
								className="w-full"
								onClick={form.handleSubmit(onSubmit)}
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Spinner size="small" />
										adding contacts...
									</>
								) : (
									"Add contact to step"
								)}
							</Button>
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

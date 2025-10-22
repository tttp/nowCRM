"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GrAddCircle } from "react-icons/gr";
import * as z from "zod";
import { AsyncSelectField } from "@/components/autoComplete/asyncSelectField";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { addContactToOrganization } from "@/lib/actions/organizations/addContactToOrganization";

const formSchema = z.object({
	contact: z.object(
		{
			value: z.number(),
			label: z.string(),
		},
		{ required_error: "Select contact" },
	),
});

export default function AddToListDialog() {
	const t = (useMessages() as any).Contacts.MassActions;
	const router = useRouter();

	const params = useParams<{ locale: string; id: string }>();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			contact: undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		const res = await addContactToOrganization(
			Number.parseInt(params.id),
			+values.contact.value,
		);
		if (!res.success) {
			toast.error(`Error during adding contact to list: ${res.errorMessage}`);
		} else {
			toast.success(`Contact ${values.contact.label} added to list`);
			router.refresh();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" className="ml-2 hidden h-8 lg:flex">
					<GrAddCircle className="mr-2 h-4 w-4" />
					Add contact
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t.Dialog.titleLists}</DialogTitle>
					<DialogDescription>
						{t.Dialog.createListDescription || "Create a new list."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<AsyncSelectField
							form={form}
							serviceName="contactService"
							name="contact"
							label="Contact"
							filterKey="first_name"
							useFormClear={true}
						/>
						<DialogClose asChild>
							<Button type="submit" className="w-full">
								<ListPlus className="mr-2 h-4 w-4" />
								Add contact to list
							</Button>
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

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
import { addContactToList } from "@/lib/actions/lists/addContactToList";

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
		const res = await addContactToList(
			+values.contact.value,
			Number.parseInt(params.id),
		);
		if (!res.success) {
			toast.error(`${t.addToListError} ${res.errorMessage}`);
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
					{t.Dialog.addContact}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t.Dialog.titleLists}</DialogTitle>
					<DialogDescription>{t.Dialog.descriptionLists}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<AsyncSelectField
							form={form}
							serviceName="contactService"
							name="contact"
							label="Contact"
							filterKey={["first_name", "last_name", "email"]}
							useFormClear={true}
							labelBuilder={(item: any) => {
								const nameParts = [item.first_name, item.last_name]
									.filter(Boolean)
									.join(" ");
								return [nameParts, item.email].filter(Boolean).join(" - ");
							}}
						/>
						<DialogClose asChild>
							<Button type="submit" className="w-full">
								<ListPlus className="mr-2 h-4 w-4" />
								{t.Dialog.addToList}
							</Button>
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

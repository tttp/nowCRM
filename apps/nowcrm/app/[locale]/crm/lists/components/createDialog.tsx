"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createList } from "@/lib/actions/lists/create-list";
import { updateList } from "@/lib/actions/lists/update-list";
import type { List } from "@/lib/types/new_type/list";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "List name must be at least 2 characters.",
	}),
});

type Props = {
	mode?: "create" | "rename";
	list?: List;
	trigger?: React.ReactNode;
};

export default function CreateListDialog({
	mode = "create",
	list,
	trigger,
}: Props) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: list?.name ?? "",
		},
	});
	const [openDialog, setOpenDialog] = React.useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (mode === "create") {
			const res = await createList(values.name);
			if (!res.success) {
				toast.error(`Error creating list: ${res.errorMessage}`);
			} else {
				toast.success(`List ${values.name} created`);
				router.refresh();
				form.reset();
				setOpenDialog(false);
			}
		} else if (mode === "rename" && list) {
			const res = await updateList(list.id, { name: values.name });
			if (!res.success) {
				toast.error(`Error renaming list: ${res.errorMessage}`);
			} else {
				toast.success(`List renamed to ${values.name}`);
				router.refresh();
				setOpenDialog(false);
			}
		}
	}

	const isCreate = mode === "create";

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button size="sm" className="ml-2 hidden h-8 lg:flex">
						<GrAddCircle className="mr-2 h-4 w-4" />
						Create
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isCreate ? "Create list" : "Rename list"}</DialogTitle>
					<DialogDescription>
						{isCreate
							? "Create a new list."
							: "Enter a new name for this list."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder={
												isCreate ? "Enter list name..." : "Enter new name..."
											}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{isCreate
											? "Choose a unique name for your new list."
											: "This will update the list name."}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							{isCreate ? (
								<>
									<ListPlus className="mr-2 h-4 w-4" />
									Create List
								</>
							) : (
								"Save"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

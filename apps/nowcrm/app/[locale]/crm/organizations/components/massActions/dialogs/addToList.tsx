"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus, Search } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import { Button } from "@/components/ui/button";
import {
	DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createList } from "@/lib/actions/lists/create-list";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "List name must be at least 2 characters.",
	}),
});

export default function AssignToListDialog({
	selectedOption,
	setSelectedOption,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
}) {
	const [listCreated, setListCreated] = React.useState(false);
	// Optional: manage active tab so that if user is on "create" when list is created,
	// we switch back to "select"
	const [activeTab, setActiveTab] = React.useState("select");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await createList(values.name);
		setSelectedOption({ value: res.data?.id, label: res.data?.name });
		setListCreated(true);
	}

	// If list is created and the user is on the "create" tab, switch to "select"
	React.useEffect(() => {
		if (listCreated && activeTab === "create") {
			setActiveTab("select");
		}
	}, [listCreated, activeTab]);

	return (
		<div className="max-w-2xl">
			<DialogHeader>
				<DialogTitle>Add to list</DialogTitle>
				<DialogDescription>select list</DialogDescription>
			</DialogHeader>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				defaultValue="select"
				className="mt-6"
			>
				<TabsList
					className={`grid w-full ${
						listCreated ? "grid-cols-1 justify-items-center" : "grid-cols-2"
					}`}
				>
					<TabsTrigger
						value="select"
						className={`flex items-center gap-2 ${listCreated ? "w-[80%]" : ""}`}
					>
						<Search className="h-4 w-4" />
						Select List
					</TabsTrigger>
					{!listCreated && (
						<TabsTrigger value="create" className="flex items-center gap-2">
							<ListPlus className="h-4 w-4" />
							Create New
						</TabsTrigger>
					)}
				</TabsList>
				<TabsContent value="select" className="space-y-4">
					<div className="mt-4">
						<AsyncSelect
							serviceName="listService"
							label="list"
							onValueChange={setSelectedOption}
							presetOption={selectedOption}
							useFormClear={false}
						/>
					</div>
				</TabsContent>
				{/* Only render the create form if a list has not been created */}
				{!listCreated && (
					<TabsContent value="create">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 py-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>List Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter list name..." {...field} />
											</FormControl>
											<FormDescription>
												Choose a unique name for your new list.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Create List
								</Button>
							</form>
						</Form>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}

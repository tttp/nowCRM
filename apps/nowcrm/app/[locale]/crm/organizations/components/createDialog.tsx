"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
	FaBuilding,
	FaLocationArrow,
	FaMapMarkerAlt,
	FaUser,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrganization } from "@/lib/actions/organizations/create-organization";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Organization name must be at least 2 characters.",
	}),
	email: z.string().optional(),
	address_line1: z.string().optional(),
	contact_person: z.string().optional(),
	location: z.string().optional(),
});

export default function CreateListDialog() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	// State to differentiate the submission action.
	// "create" will close the dialog while "continue" will reset the form to allow further entries.
	const [submitAction, setSubmitAction] = React.useState<"create" | "continue">(
		"create",
	);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await createOrganization({
			...values,
			publishedAt: new Date(),
		});
		console.log(res);
		if (!res.success) {
			toast.error(`Error during creating organization ${res.errorMessage}`);
		} else {
			toast.success(`Organization ${values.name} created`);
			if (submitAction === "continue") {
				// Reset the form to continue creating new organizations.
				form.reset();
				router.refresh();
			} else {
				// For the "create" action, refresh and let the dialog close.
				setDialogOpen(false);
				form.reset();
				router.refresh();
			}
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="ml-2 hidden h-10 lg:flex"
					onClick={() => setDialogOpen(true)}
				>
					<GrAddCircle className="h-4 w-4" />
					Create
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
					<DialogDescription>Create a new organization.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaBuilding className="mr-2 text-primary" /> Name
									</FormLabel>
									<FormControl>
										<Input placeholder="name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaMessage className="mr-2 text-primary" /> Email
									</FormLabel>
									<FormControl>
										<Input placeholder="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address_line1"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaMapMarkerAlt className="mr-2 text-primary" /> Address
										Line 1
									</FormLabel>
									<FormControl>
										<Input placeholder="Address Line 1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="contact_person"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center">
										<FaUser className="mr-2 text-primary" /> Contact Person
									</FormLabel>
									<FormControl>
										<Input placeholder="Contact Person" {...field} />
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
										<FaLocationArrow className="mr-2 text-primary" /> Location
									</FormLabel>
									<FormControl>
										<Input placeholder="Location" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Two submit buttons: one closes the dialog, the other continues */}
						<div className="flex space-x-2">
							<Button
								type="submit"
								onClick={() => setSubmitAction("create")}
								className="w-full"
							>
								<ListPlus className="mr-2 h-4 w-4" />
								Create
							</Button>
							<Button
								type="submit"
								onClick={() => setSubmitAction("continue")}
								className="w-full"
							>
								<ListPlus className="mr-2 h-4 w-4" />
								Continue Creating
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

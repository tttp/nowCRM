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
import { createJourney } from "@/lib/actions/journeys/createJourney";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "List name must be at least 2 characters.",
	}),
});

export default function CreateListDialog() {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const res = await createJourney(values.name);
			if (!res.success) {
				toast.error(`Error during creating journey ${res.errorMessage}`);
			} else {
				toast.success(`Journey ${values.name} created`);
				router.refresh();
				form.reset();
				setDialogOpen(false);
			}
		} catch (error) {
			toast.error("Unexpected error while creating journey");
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="ml-2 hidden h-10 lg:flex">
					<GrAddCircle className=" h-4 w-4" />
					Create
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create new Journey</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Journeys Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter journeys name..." {...field} />
									</FormControl>
									<FormDescription>
										Choose a unique name for your new journey.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={loading}>
							<ListPlus className="mr-2 h-4 w-4" />
							Create Journey
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

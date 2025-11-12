"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, TagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTag } from "@/lib/actions/tags/create-tag";
import { fetchTags } from "@/lib/actions/tags/fetch-tags";
import { Tag } from "@nowcrm/services";


interface AddTagDialogProps {
	contactId: number;
	currentTags: Tag[];
	onTagAdded: (tag: Tag) => void;
}

const createTagSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Tag name is required" })
		.max(50, { message: "Tag name must be less than 50 characters" }),
	color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color"),
});

export function AddTagDialog({
	contactId,
	currentTags,
	onTagAdded,
}: AddTagDialogProps) {
	const [open, setOpen] = useState(false);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("select");
	const [creatingTag, setCreatingTag] = useState(false);
	const [tagCreatedSuccessfully, setTagCreatedSuccessfully] = useState(false);

	const form = useForm<z.infer<typeof createTagSchema>>({
		resolver: zodResolver(createTagSchema),
		defaultValues: {
			name: "",
			color: "#3b82f6",
		},
	});

	const refetchTags = async () => {
		try {
			const res = await fetchTags();
			setTags(res.data || []);
		} catch (e) {
			console.error("Failed to fetch tags", e);
		}
	};

	useEffect(() => {
		refetchTags();
	}, []);

	// Auto-switch to select tab only after successful tag creation
	useEffect(() => {
		if (tagCreatedSuccessfully && activeTab === "create") {
			console.log(
				"[TAG DIALOG] Tag created successfully, switching to select tab",
			);
			setActiveTab("select");
			setTagCreatedSuccessfully(false); // Reset flag
		}
	}, [tagCreatedSuccessfully, activeTab]);

	const availableTags = tags.filter(
		(tag) => !currentTags.some((currentTag) => currentTag.id === tag.id),
	);

	const handleAddTag = async (tag: Tag) => {
		setLoading(true);
		try {
			onTagAdded(tag);
			setOpen(false);
		} catch (error) {
			console.error("Failed to add tag", error);
		} finally {
			setLoading(false);
		}
	};

	async function onCreateTag(values: z.infer<typeof createTagSchema>) {
		setCreatingTag(true);
		try {
			const { default: toast } = await import("react-hot-toast");
			const res = await createTag(values.name, values.color);

			if (!res.success) {
				toast.error(`Failed to create tag: ${res.errorMessage}`);
			} else {
				toast.success(`Tag "${values.name}" created successfully!`);
				console.log("[TAG DIALOG] Tag created, refetching tags...");
				// Refetch tags to include the newly created one
				await refetchTags();
				// Reset form
				form.reset();
				// Set flag to trigger auto-switch
				setTagCreatedSuccessfully(true);
			}
		} catch (error) {
			console.error("Failed to create tag", error);
			const { default: toast } = await import("react-hot-toast");
			toast.error("Failed to create tag");
		} finally {
			setCreatingTag(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 rounded-full p-0 transition-colors hover:bg-accent/50"
				>
					<Plus className="h-3 w-3" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<TagIcon className="h-5 w-5" />
						Add Tag
					</DialogTitle>
					<DialogDescription>
						Select a tag to add to this contact or create a new one.
					</DialogDescription>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="select" className="flex items-center gap-2">
							<TagIcon className="h-4 w-4" />
							Select Tag
						</TabsTrigger>
						<TabsTrigger value="create" className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Create New
						</TabsTrigger>
					</TabsList>

					<TabsContent value="select" className="mt-4">
						<Command className="rounded-lg border shadow-md">
							<CommandInput placeholder="Search tags..." />
							<CommandList>
								<CommandEmpty>
									{tags.length === 0
										? "No tags available."
										: "No available tags. All tags are already assigned."}
								</CommandEmpty>
								<CommandGroup>
									{availableTags.map((tag) => (
										<CommandItem
											key={tag.id}
											onSelect={() => handleAddTag(tag)}
											className="flex cursor-pointer items-center gap-2"
											disabled={loading}
										>
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: tag.color }}
											/>
											<Badge
												variant="secondary"
												className="px-2 py-0.5 font-medium text-xs"
												style={{
													backgroundColor: `${tag.color}20`,
													color: tag.color,
													border: `1px solid ${tag.color}40`,
												}}
											>
												{tag.name}
											</Badge>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</TabsContent>

					<TabsContent value="create" className="mt-4 space-y-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onCreateTag)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tag Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter tag name..."
													{...field}
													disabled={creatingTag}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="color"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel>Pick a color</FormLabel>
												<input
													type="color"
													{...field}
													className="h-8 w-16 cursor-pointer rounded-md border p-1"
													disabled={creatingTag}
												/>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={creatingTag}>
									{creatingTag ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										<>
											<Plus className="mr-2 h-4 w-4" />
											Create Tag
										</>
									)}
								</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { TypographyH3 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateList } from "@/lib/actions/lists/updateList";

interface EditableTitleProps {
	title: string;
}

const formSchema = z.object({
	title: z.string().min(1, "List name should not be empty"),
});

export default function EditableTitle({ title }: EditableTitleProps) {
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const params = useParams<{ locale: string; id: string }>();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: title,
		},
	});

	// Focus input when entering edit mode
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await updateList(Number.parseInt(params.id), {
				name: values.title,
			});
			console.log(res);
			if (!res.success) {
				toast.error(`Error updating list title: ${res.errorMessage}`);
			} else {
				toast.success("List title updated");
				router.refresh();
				setIsEditing(false);
			}
		} catch (_error) {
			toast.error("An unexpected error occurred");
		}
	}

	function handleCancel() {
		form.reset({ title });
		setIsEditing(false);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Escape") {
			handleCancel();
		}
	}

	if (isEditing) {
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-center gap-2"
					onKeyDown={handleKeyDown}
				>
					<div className="flex items-center py-2">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormControl>
										<Input
											id="name"
											{...field}
											ref={inputRef}
											className="w-max py-2"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-1">
							<Button
								type="submit"
								size="icon"
								variant="ghost"
								className="h-8 w-8 "
							>
								<Check className="h-4 w-4" />
								<span className="sr-only">Save</span>
							</Button>
							<Button
								type="button"
								size="icon"
								variant="ghost"
								onClick={handleCancel}
								className="h-8 w-8"
							>
								<X className="h-4 w-4" />
								<span className="sr-only">Cancel</span>
							</Button>
						</div>
					</div>
				</form>
			</Form>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<TypographyH3 className={"py-2 capitalize"}>{title} list</TypographyH3>
			<Button
				size="icon"
				variant="ghost"
				onClick={() => setIsEditing(true)}
				className="h-8 w-8"
			>
				<Pencil className="h-4 w-4" />
				<span className="sr-only">Edit title</span>
			</Button>
		</div>
	);
}

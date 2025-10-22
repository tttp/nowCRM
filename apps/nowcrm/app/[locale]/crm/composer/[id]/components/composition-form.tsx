"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface CompositionFormProps {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => Promise<void>;
	onInvalid?: (errors: any) => void;
	isEditing: boolean;
	activeTab: string;
	children: ReactNode;
}

export function CompositionForm({
	form,
	onSubmit,
	onInvalid,
	children,
}: CompositionFormProps) {
	return (
		<Form {...form}>
			<form
				id="composition-form"
				onSubmit={form.handleSubmit(onSubmit, onInvalid)}
			>
				{children}
			</form>
		</Form>
	);
}

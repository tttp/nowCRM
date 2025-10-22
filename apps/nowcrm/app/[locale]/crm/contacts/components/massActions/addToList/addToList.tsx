"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { createList } from "@/lib/actions/lists/createList";
import SelectOrCreateListTabs from "./SelectOrCreateListTabs";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "List name must be at least 2 characters.",
	}),
});

export default function AssignToListDialog({
	selectedOption,
	setSelectedOption,
	selectedRows,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
	selectedRows: number | undefined;
}) {
	const [activeTab, setActiveTab] = React.useState("select");
	const [listCreated, setListCreated] = React.useState(false);
	const [isCreatingList, setIsCreatingList] = React.useState(false);
	const [listCreationSuccess, setListCreationSuccess] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "" },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsCreatingList(true);
		try {
			const res = await createList(values.name);
			if (res?.data?.id) {
				setSelectedOption({ value: res.data.id, label: res.data.name });
				setListCreated(true);
				setListCreationSuccess(true);
				// bounce back to select tab shortly after success
				setTimeout(() => setActiveTab("select"), 1000);
			}
		} finally {
			setIsCreatingList(false);
		}
	}

	React.useEffect(() => {
		if (listCreated && activeTab === "create") {
			setActiveTab("select");
		}
	}, [listCreated, activeTab]);

	return (
		<div className="borde rounded-lg p-6">
			<DialogHeader>
				<DialogTitle>Add contacts to List</DialogTitle>
				<DialogDescription>Add selected contacts to List</DialogDescription>
			</DialogHeader>

			<div className="mt-6">
				<SelectOrCreateListTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					listCreated={listCreated}
					listCreationSuccess={listCreationSuccess}
					totalCount={selectedRows || 0}
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
					form={form}
					onSubmit={onSubmit}
					isCreatingList={isCreatingList}
				/>
			</div>
		</div>
	);
}

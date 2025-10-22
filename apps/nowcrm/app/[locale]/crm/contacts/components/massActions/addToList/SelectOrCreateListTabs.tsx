"use client";

import { CheckCircle, ListPlus, Search } from "lucide-react";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SelectOption = { value: string; label: string } | null;

export type SelectOrCreateListTabsProps = {
	activeTab: string;
	setActiveTab: (value: string) => void;

	listCreated: boolean;
	listCreationSuccess: boolean;
	totalCount: number;

	selectedOption: SelectOption;
	setSelectedOption: (value: any) => void;

	// Create tab
	form: UseFormReturn<{ name: string }>;
	onSubmit: (values: { name: string }) => Promise<void> | void;
	isCreatingList: boolean;
};

export default function SelectOrCreateListTabs({
	activeTab,
	setActiveTab,
	listCreated,
	listCreationSuccess,
	totalCount,
	selectedOption,
	setSelectedOption,
	form,
	onSubmit,
	isCreatingList,
}: SelectOrCreateListTabsProps) {
	return (
		<div className="min-h-0 flex-1">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				defaultValue="select"
				className="flex h-full flex-col"
			>
				<TabsList
					className={`grid w-full flex-shrink-0 rounded-lg bg-gray-100 p-1 ${
						listCreated ? "grid-cols-1 justify-items-center" : "grid-cols-2"
					}`}
				>
					<TabsTrigger
						value="select"
						className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all ${
							listCreated ? "w-[80%]" : ""
						} data-[state=active]:bg-white data-[state=active]:shadow-sm`}
					>
						<Search className="h-4 w-4" />
						Select Existing List
					</TabsTrigger>

					{!listCreated && (
						<TabsTrigger
							value="create"
							className="flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
						>
							<ListPlus className="h-4 w-4" />
							Create New List
						</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value="select" className="mt-6 flex-1 space-y-4">
					{listCreationSuccess && (
						<div className="rounded-lg border border-green-200 bg-green-50 p-4">
							<div className="flex items-center gap-2">
								<CheckCircle className="h-5 w-5 text-green-600" />
								<span className="font-medium text-green-800">
									List created successfully!
								</span>
							</div>
						</div>
					)}

					<div className="space-y-3">
						<label className="block font-medium text-gray-700 text-sm">
							Choose a list to add your {totalCount} filtered contacts
						</label>
						<div className="relative z-50">
							<AsyncSelect
								serviceName="listService"
								label="list"
								onValueChange={setSelectedOption}
								presetOption={selectedOption ? selectedOption : undefined}
								useFormClear={false}
							/>
						</div>

						{selectedOption && (
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-blue-600" />
									<span className="text-blue-800 text-sm">
										Selected: <strong>{selectedOption.label}</strong>
									</span>
								</div>
							</div>
						)}
					</div>
				</TabsContent>

				{!listCreated && (
					<TabsContent value="create" className="mt-6 flex-1">
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
							<div className="mb-4">
								<h4 className="font-medium text-gray-900">Create New List</h4>
								<p className="text-gray-600 text-sm">
									Create a new list to organize your contacts
								</p>
							</div>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Enter a descriptive name for your list..."
														className="bg-white"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="w-full"
										disabled={isCreatingList}
									>
										{isCreatingList ? (
											<>
												<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
												Creating List...
											</>
										) : (
											<>
												<ListPlus className="mr-2 h-4 w-4" />
												Create List
											</>
										)}
									</Button>
								</form>
							</Form>
						</div>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}

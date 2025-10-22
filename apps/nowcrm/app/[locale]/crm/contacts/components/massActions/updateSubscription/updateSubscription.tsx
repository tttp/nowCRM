"use client";

import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UpdateSubscriptionForm } from "./UpdateSubscriptionForm";

export default function UpdateSubscriptionDialog({
	selectedOption,
	setSelectedOption,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
}) {
	return (
		<div className="rounded-lg border p-6">
			<DialogHeader>
				<DialogTitle>Update Subscription</DialogTitle>
				<DialogDescription>
					Update subscription for selected contacts
				</DialogDescription>
			</DialogHeader>

			<UpdateSubscriptionForm
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		</div>
	);
}

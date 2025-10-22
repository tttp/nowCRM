"use client";

import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function AddToJourneyDialog({
	selectedOption,
	setSelectedOption,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
}) {
	return (
		<div className="rounded-lg border p-6">
			<DialogHeader>
				<DialogTitle>Add contacts to Journey Step</DialogTitle>
				<DialogDescription>
					Add selected contacts to Journey Step
				</DialogDescription>
			</DialogHeader>
			<div className="mt-6">
				<AsyncSelect
					serviceName="journeyStepsService"
					label="journeyStep"
					onValueChange={setSelectedOption}
					presetOption={selectedOption}
					useFormClear={false}
				/>
			</div>
		</div>
	);
}

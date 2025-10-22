"use client";
import * as React from "react";

import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import SelectOrCreateOrganizationTabs from "./SelectOrCreateOrgTab";

export default function AddToOrganizationDialog({
	selectedOption,
	setSelectedOption,
}: {
	selectedOption: any;
	setSelectedOption: (value: any) => void;
}) {
	const [orgCreated, setOrgCreated] = React.useState(false);

	return (
		<div className="borde rounded-lg p-6">
			<DialogHeader>
				<DialogTitle>Add contacts to Organization</DialogTitle>
				<DialogDescription>
					Add selected contacts to Organization
				</DialogDescription>
			</DialogHeader>

			<SelectOrCreateOrganizationTabs
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				orgCreated={orgCreated}
				setOrgCreated={setOrgCreated}
			/>
		</div>
	);
}

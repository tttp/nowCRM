"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Organization } from "@/lib/types/new_type/organization";
import { EditDialogOrganizationGeneral } from "./editDialogGeneral";

interface OrganizationGeneralInfoCardProps {
	organization: Organization;
}

export function OrganizationGeneralInfoCard({
	organization,
}: OrganizationGeneralInfoCardProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Organization Information</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							Edit
						</Button>
					</CardTitle>
					<CardDescription>
						Basic details about the organization
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p>
						<strong>Name:</strong> {organization.name}
					</p>
					<p>
						<strong>Email:</strong> {organization.email}
					</p>
					<p>
						<strong>Contact Person:</strong> {organization.contact_person}
					</p>
					{organization.tags && (
						<p>
							<strong>Tag:</strong>{" "}
							{organization.tags.map((o) => o?.name ?? "").join(", ") || ""}
						</p>
					)}
					{organization.description && (
						<p>
							<strong>Description:</strong> {organization.description}
						</p>
					)}
				</CardContent>
			</Card>
			<EditDialogOrganizationGeneral
				organization={organization}
				isOpen={isEditing}
				onClose={() => setIsEditing(false)}
			/>
		</>
	);
}

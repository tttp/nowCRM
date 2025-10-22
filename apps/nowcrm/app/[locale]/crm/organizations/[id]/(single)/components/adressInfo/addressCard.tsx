"use client";

import { MapPin } from "lucide-react";
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
import { EditDialogOrganizationAddress } from "./editDialogAddress";

interface OrganizationAddressCardProps {
	organization: Organization;
}

export function OrganizationAddressCard({
	organization,
}: OrganizationAddressCardProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Address Information</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							Edit
						</Button>
					</CardTitle>
					<CardDescription>Location and address details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-start space-x-3">
						<MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div>
							{organization.address_line1 && (
								<p>{organization.address_line1}</p>
							)}
							{organization.location && (
								<p>
									{organization.location}
									{organization.canton && `, ${organization.canton}`}
									{organization.zip && `, ${organization.zip}`}
									{organization.country && `, ${organization.country}`}
								</p>
							)}
						</div>
					</div>
					{!organization.address_line1 &&
						!organization.location &&
						!organization.country && (
							<p className="text-muted-foreground italic">
								No address information available
							</p>
						)}
				</CardContent>
			</Card>
			<EditDialogOrganizationAddress
				organization={organization}
				isOpen={isEditing}
				onClose={() => setIsEditing(false)}
			/>
		</>
	);
}

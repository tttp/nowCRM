"use client";

import { Facebook, Globe, Link2 } from "lucide-react";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ensureValidUrl } from "@/lib/ensureValidUrl";
import type { Organization } from "@/lib/types/new_type/organization";
import { EditDialogOrganizationProfessional } from "./editDialogProfessional";

interface OrganizationProfessionalInfoCardProps {
	organization: Organization;
}

export function OrganizationProfessionalInfoCard({
	organization,
}: OrganizationProfessionalInfoCardProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Professional Information</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							Edit
						</Button>
					</CardTitle>
					<CardDescription>Work, media, and social details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						{organization.organization_type && (
							<p>
								<strong>Type:</strong> {organization.organization_type.name}
							</p>
						)}
						{organization.frequency && (
							<p>
								<strong>Frequency:</strong> {organization.frequency.name}
							</p>
						)}
						{organization.media_type && (
							<p>
								<strong>Media Type:</strong> {organization.media_type.name}
							</p>
						)}
						{organization.url && (
							<p>
								<strong>Website:</strong>{" "}
								<a
									href={ensureValidUrl(organization.url)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									{organization.url}
								</a>
							</p>
						)}
					</div>
					<div className="flex items-start space-x-3">
						<Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div className="space-y-1">
							{organization.linkedin_url && (
								<a
									href={ensureValidUrl(organization.linkedin_url)}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center text-primary hover:underline"
								>
									<Link2 className="mr-1 h-4 w-4" /> LinkedIn
								</a>
							)}
							{organization.twitter_url && (
								<a
									href={ensureValidUrl(organization.twitter_url)}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center text-primary hover:underline"
								>
									<FaXTwitter className="mr-1 h-4 w-4" /> Twitter&#40;X&#41;
								</a>
							)}
							{organization.facebook_url && (
								<a
									href={ensureValidUrl(organization.facebook_url)}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center text-primary hover:underline"
								>
									<Facebook className="mr-1 h-4 w-4" /> Facebook
								</a>
							)}
						</div>
					</div>
					{!organization.organization_type && !organization.url && (
						<p className="text-muted-foreground italic">
							No professional information available
						</p>
					)}
				</CardContent>
			</Card>
			<EditDialogOrganizationProfessional
				organization={organization}
				isOpen={isEditing}
				onClose={() => setIsEditing(false)}
			/>
		</>
	);
}

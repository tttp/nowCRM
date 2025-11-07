import type { Metadata } from "next";
import type React from "react";
import { FaBuilding, FaEnvelope } from "react-icons/fa";
import DeleteButton from "@/components/deleteButton/deleteButton";
import ErrorMessage from "@/components/ErrorMessage";
import { TypographyH4 } from "@/components/Typography";
import { Separator } from "@/components/ui/separator";
import { RouteConfig } from "@/lib/config/RoutesConfig";
import { DocumentId } from "@nowcrm/services";
import { auth } from "@/auth";
import { organizationsService } from "@nowcrm/services/server";
interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: DocumentId }>;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Organization detail",
		description: "Organization details",
	};
}

export default async function Layout(props: LayoutProps) {
	const params = await props.params;

	const { children } = props;
	const organizationId = params.id;
	const session = await auth();

	const organization = await organizationsService.findOne(organizationId, session?.jwt );
	if (!organization.data) {
		return <ErrorMessage response={organization} />;
	}
	return (
		<div className="container mt-2">
			<header className="flex justify-between">
				<TypographyH4 className="flex items-center">
					<FaBuilding className="mx-2 h-4 w-4 text-primary" />
					{organization.data.name}
					<div className="flex items-center text-sm4">
						<FaEnvelope className="mx-2 h-4 w-4 text-primary" />
						{organization.data.email}
					</div>
				</TypographyH4>
				<DeleteButton
					label="delete"
					successMessage="Organization deleted"
					redirectURL={RouteConfig.organizations.base}
					serviceName="organizationsService"
					id={organizationId}
				/>
			</header>
			<Separator className="my-4" />
			<main>{children}</main>
		</div>
	);
}

// app/[locale]/crm/forms/[id]/page.tsx

import type { Metadata } from "next";
import FormBuilder from "@/components/forms/FormBuilder";

// Standard metadata export remains unchanged
export const metadata: Metadata = {
	title: "nowCRM Build form",
	description: "Use this page to build and customize your form",
};

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const formId = Number(id);

	return (
		<div className="container mx-auto py-8">
			<FormBuilder formId={formId} />
		</div>
	);
}

import type { Metadata } from "next";
import { PrivacyPolicyDisplay } from "@/components/infoPages/privacyPolicyDisplay";

export const metadata: Metadata = {
	title: "Privacy Policy",
};

export default async function Page(props: { params: Promise<{ id: number }> }) {
	const params = await props.params;
	return (
		<div className="container mt-2">
			<PrivacyPolicyDisplay id={params.id} />
		</div>
	);
}

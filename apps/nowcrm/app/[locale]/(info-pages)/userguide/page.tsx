import type { Metadata } from "next";
import { UserGuideDisplay } from "@/components/infoPages/userGuideDisplay";

export const metadata: Metadata = {
	title: "User guide , User Manual",
};

export default async function Page() {
	return (
		<div className="items-center justify-center p-24">
			<UserGuideDisplay />
		</div>
	);
}

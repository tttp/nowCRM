import type { Metadata } from "next";
import SignUp from "./components/signup";
export const metadata: Metadata = {
	title: "Manage Subcription nowCRM",
};

export default async function Page(props: {
	searchParams: Promise<{ unsubscribe_token?: string }>;
}) {
	const searchParams = await props.searchParams;
	// Extract the values, using empty strings as defaults if they are not provided
	const unsubscribe_token = searchParams.unsubscribe_token || "";

	return <SignUp unsubscribe_token={unsubscribe_token} />;
}

//contactsapp/app/[locale]/crm/(user-info)/profile/page.tsx

import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import ProfileCard from "./components/profile-card";

export default async function ProfilePage() {
	const t = await getTranslations("UserInfo");
	const session = await auth();

	if (!session?.user) {
		return <div className="p-4">{t("noUserFound")}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<ProfileCard user={session.user} />
		</div>
	);
}

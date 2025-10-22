// contactsapp/app/[locale]/crm/(user-info)/profile/edit/page.tsx

import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import EditProfileForm from "../components/edit-profile-form";

export default async function EditProfilePage() {
	const t = await getTranslations("UserInfo");
	const session = await auth();

	if (!session?.user) {
		return <div className="p-4">{t("noUserFound")}</div>;
	}

	return (
		<div className="container mx-auto max-w-2xl p-4">
			<EditProfileForm user={session.user} />
		</div>
	);
}

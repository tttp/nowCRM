"use server";
import { getTranslations } from "next-intl/server";
import type { StandardResponse } from "@/lib/services/common/response.service";
import userService from "@/lib/services/new_type/users.service";
import type { Form_User } from "@/lib/types/new_type/user";

export async function registerAction(
	values: Partial<Form_User>,
): Promise<StandardResponse<null>> {
	const t = await getTranslations("Auth.Register");
	try {
		const check = await userService.find({
			filters: { email: { $eq: values.email } },
		});
		if (check.data && check.data?.length > 0) {
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: t("errors.emailRegistered"),
			};
		}
		const res = await userService.register(values);
		return res;
	} catch (error: any) {
		console.log(error);
		throw new Error(`Failed to register account ${error.message}`);
	}
}

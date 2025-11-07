"use server";
import { env } from "@/lib/config/envConfig";
import { Form_User } from "@nowcrm/services";
import { StandardResponse, usersService } from "@nowcrm/services/server";
import { getTranslations } from "next-intl/server";


export async function registerAction(
	values: Partial<Form_User>,
): Promise<StandardResponse<null>> {
	const t = await getTranslations("Auth.Register");
	try {
		const check = await usersService.find(env.CRM_STRAPI_API_TOKEN, {
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
		const res = await usersService.register(values,env.CRM_STRAPI_API_TOKEN);
		return res;
	} catch (error: any) {
		console.log(error);
		throw new Error(`Failed to register account ${error.message}`);
	}
}

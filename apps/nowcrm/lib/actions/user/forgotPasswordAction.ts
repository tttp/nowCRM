// contactsapp/lib/actions/user/forgotPasswordAction.ts
"use server";
import userService from "@/lib/services/new_type/users.service";

type ForgotPasswordValues = {
	email: string;
};

export async function onSubmitForgotPassword(values: ForgotPasswordValues) {
	try {
		const result = await userService.forgotPassword(values.email);

		if (!result.success) {
			return {
				error: result.errorMessage || "Failed to send reset password email",
			};
		}

		return { success: true };
	} catch (error: any) {
		console.error("Forgot password error:", error);
		return {
			error: error.message || "An unexpected error occurred",
		};
	}
}

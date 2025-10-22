"use server";
import userService from "@/lib/services/new_type/users.service";

type ResetPasswordValues = {
	code: string;
	password: string;
	passwordConfirmation: string;
};

export async function onSubmitResetPassword(values: ResetPasswordValues) {
	try {
		const result = await userService.resetPassword(
			values.code,
			values.password,
			values.passwordConfirmation,
		);

		if (!result.success) {
			return {
				error: result.errorMessage || "Failed to reset password",
			};
		}

		return {
			success: true,
			user: result.data,
		};
	} catch (error: any) {
		console.error("Reset password error:", error);
		return {
			error: error.message || "An unexpected error occurred",
		};
	}
}

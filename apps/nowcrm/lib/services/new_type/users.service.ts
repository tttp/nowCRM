// src/services/contact.service.ts

import { auth } from "@/auth";
import { env } from "@/lib/config/envConfig";
import type { Form_User, strapi_user, User } from "@/lib/types/new_type/user";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";
import {
	handleError,
	handleResponse,
	type StandardResponse,
} from "../common/response.service";
import type Asset from "./assets/asset";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class UserService extends BaseService<User, Form_User> {
	private static instance: UserService;

	private constructor() {
		super(APIRoutes.USERS);
	}

	/**
	 * Retrieves the singleton instance of UserService.
	 * @returns {UserService} - The singleton instance.
	 */
	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async authenticateCredentials(
		email: string,
		password: string,
	): Promise<User | null> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.AUTH_LOGIN}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify({
					identifier: email,
					password: password,
				}),
			});

			const data = await response.json();

			if (data.error) {
				// Invalid credentials or other error
				console.log("Authentication failed:", data.error.message);
				return null;
			}

			// Return the user data for 2FA checking
			return data.user;
		} catch (error) {
			console.error("Error authenticating credentials:", error);
			return null;
		}
	}

	/**
	 * Get user by ID for 2FA verification
	 * @param userId - User ID
	 * @returns User object or null if not found
	 */
	async getById(userId: number): Promise<User | null> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.USERS}/${userId}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.getHeaders(false, env.CRM_STRAPI_API_TOKEN),
			});

			if (!response.ok) {
				if (response.status === 404) {
					return null;
				}
				throw new Error(`Failed to fetch user. Status: ${response.status}`);
			}

			const user: User = await response.json();
			return user;
		} catch (error) {
			console.error(`Error fetching user ${userId}:`, error);
			return null;
		}
	}

	/**
	 * Get user by email for 2FA completion
	 * @param email - User email
	 * @returns User object or null if not found
	 */
	async getByEmail(email: string): Promise<User | null> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.USERS}?filters[email][$eq]=${encodeURIComponent(email)}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.getHeaders(false, env.CRM_STRAPI_API_TOKEN),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch user by email. Status: ${response.status}`,
				);
			}

			const data = await response.json();

			// Strapi returns an array when using filters
			if (data && data.length > 0) {
				return data[0];
			}

			return null;
		} catch (error) {
			console.error(`Error fetching user by email ${email}:`, error);
			return null;
		}
	}

	async register(
		userData: Partial<Form_User>,
	): Promise<StandardResponse<null>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.REGISTER}`;
		console.log(userData);
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify(userData),
			});

			return await handleResponse<null>(response);
		} catch (error: any) {
			console.error("Error registering user:", error);
			return handleError<null>(error);
		}
	}

	async login(userData: {
		identifier: string;
		password: string;
	}): Promise<StandardResponse<strapi_user>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.AUTH_LOGIN}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify(userData),
			});
			const data = await response.json();
			if (data.error) {
				if (data.error.status === 403) {
					return {
						data: null,
						status: data.error.status,
						success: false,
						errorMessage:
							"Api token used for loggin is missing access to user-permissions table",
					};
				}
				return {
					data: null,
					status: data.error.status,
					success: false,
					errorMessage: `${data.error.message}`,
				};
			}

			await this.update(data.user.id, { jwt_token: data.jwt }, true, true);

			return {
				data: data,
				status: 200,
				success: true,
			};
		} catch (error: any) {
			return {
				data: null,
				status: 400,
				success: false,
				errorMessage: `Error logging in user: ${error}`,
			};
		}
	}

	// upload profile picture service designed for strapi

	async uploadProfilePicture(
		files: any,
		userId: number,
	): Promise<StandardResponse<Asset[]>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.UPLOAD}`;
		const session = await auth();
		if (!session) {
			return {
				data: null,
				status: 403,
				success: false,
			};
		}

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
		formData.append("ref", "plugin::users-permissions.user");
		formData.append("refId", userId.toString());
		formData.append("field", "image");
		try {
			//TODO: remove config service from here
			const response = await fetch(url, {
				headers: this.getHeaders(false, session.jwt),
				cache: "no-store",
				method: "POST",
				body: formData,
			});
			return await handleResponse(response);
		} catch (error: any) {
			return handleError(error);
		}
	}

	// update profile with basic info
	async updateProfile(
		userId: number,
		data: {
			username?: string;
			email?: string;
			is2FAEnabled?: boolean;
			totpSecret?: string | null;
		},
	): Promise<User> {
		// Returning the updated Strapi User object
		// Use the base path from the constructor + /:id for the specific user
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.USERS}/${userId}`; // e.g., http://host/api/users/123

		// Ensure we only proceed if there's data to update
		if (Object.keys(data).length === 0) {
			console.warn("updateProfile service called with no data.");
			throw new Error("No data provided for profile update.");
		}

		// Validate 2FA data
		if (data.is2FAEnabled === true && !data.totpSecret) {
			throw new Error("TOTP secret is required when enabling 2FA");
		}

		try {
			// Use PUT for update, assumes CRM_STRAPI_API_TOKEN grants update permission
			const response = await fetch(url, {
				method: "PUT",
				// Use getHeaders for consistency, ensure it sets JSON content type and Bearer token
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify(data),
			});

			// Use handleResponse/handleError pattern for consistency if desired
			if (!response.ok) {
				const errorBody = await response.text();
				console.error(
					`Strapi Update Profile Service Error (${response.status}) for user ${userId}: ${errorBody}`,
				);
				throw new Error(
					`Failed to update profile via service for user ${userId}. Status: ${response.status}`,
				);
			}

			const updatedUser: User = await response.json();
			return updatedUser;
		} catch (error) {
			console.error(
				`Error in updateProfile service for user ${userId}:`,
				error,
			);
			throw error instanceof Error
				? error
				: new Error(
						"An unknown error occurred during profile update service call.",
					);
		}
	}

	async forgotPassword(email: string): Promise<StandardResponse<null>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.FORGOT_PASSWORD}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify({ email }),
			});

			return await handleResponse<null>(response);
		} catch (error: any) {
			console.error("Error requesting password reset:", error);
			return handleError<null>(error);
		}
	}

	async resetPassword(
		code: string,
		password: string,
		passwordConfirmation: string,
	): Promise<StandardResponse<strapi_user>> {
		const url = `${env.CRM_STRAPI_API_URL}${APIRoutes.RESET_PASSWORD}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(true, env.CRM_STRAPI_API_TOKEN),
				body: JSON.stringify({
					code,
					password,
					passwordConfirmation,
				}),
			});

			return await handleResponse<strapi_user>(response);
		} catch (error: any) {
			console.error("Error resetting password:", error);
			return handleError<strapi_user>(error);
		}
	}
}

const userService = UserService.getInstance();
export default userService;

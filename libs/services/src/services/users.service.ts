import { API_ROUTES_STRAPI } from "../api-routes/api-routes-strapi";
import { envServices } from "../envConfig";
import { handleError, handleResponse, StandardResponse } from "../server";
import Asset from "../types/common/asset";
import type { Form_User, User } from "../types/user";
import BaseService from "./common/base.service";

class UsersService extends BaseService<User, Form_User> {
	public constructor() {
		super(API_ROUTES_STRAPI.USERS);
	}

	async uploadProfilePicture(
		files: any,
		userId: number,
		token: string,
	): Promise<StandardResponse<Asset[]>> {
		const url = `${envServices.STRAPI_URL}${API_ROUTES_STRAPI.UPLOAD}`;
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
				headers: this.getHeaders(false, token),
				cache: "no-store",
				method: "POST",
				body: formData,
			});
			return await handleResponse(response);
		} catch (error: any) {
			return handleError(error);
		}
	}

	async updateProfile(
		userId: number,
		data: {
			username?: string;
			email?: string;
			is2FAEnabled?: boolean;
			totpSecret?: string | null;
		},
		token: string,
	): Promise<User> {
		// Returning the updated Strapi User object
		// Use the base path from the constructor + /:id for the specific user
		const url = `${envServices.STRAPI_URL}${API_ROUTES_STRAPI.USERS}/${userId}`; // e.g., http://host/api/users/123

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
				headers: this.getHeaders(true, token),
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

			const updatedUser = await response.json();
			return updatedUser as User ;
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

}

export const usersService = new UsersService();

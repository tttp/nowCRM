import { User } from "next-auth";
declare module "next-auth" {
	/**
	 * Adding custom properties to the NextAuth user type
	 */

	interface User {
		name: string;
		username: string;
		role: any;
		email: string;
		confirmed: boolean;
		blocked: boolean;
		createdAt: string;
		updatedAt: string;
		image: any;
		jwt_token: string;
		twoFARequired?: boolean;
		twoFAEnabled?: boolean;
		totpSecret?: string;
	}

	interface Session {
		user: {
			username: string;
			email: string;
			image: any;
			role: any;
			strapi_id: number;
			twoFARequired?: boolean;
			twoFAEnabled?: boolean;
			totpSecret?: string;
		};
		jwt: any;
	}
}

import type { BaseFormType, BaseType } from "../common/base_type";

interface UserRole {
	id: number;
	name: string;
}

// Filters - json which used for strapi filters for entity for coresponding type
export interface User extends BaseType {
	username: string;
	email: string;
	confirmed: boolean;
	blocked: boolean;
	role: UserRole;
	jwt_token: string; // handles strapi access jwt
	image: any;
	is2FAEnabled?: boolean;
	totpSecret?: string;
}

export interface Form_User extends BaseFormType {
	username: string;
	email: string;
	password: string;
	confirmed: boolean;
	blocked: boolean;
	role: number;
	jwt_token: string;
	image: any; //handling image only as url
	is2FAEnabled?: boolean;
	totpSecret?: string;
}

export type strapi_user = {
	jwt: string;
	user: {
		id: string; // here is not number since next-auth doesnt provde overriding
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
		is2FAEnabled?: boolean;
		totpSecret?: string;
	};
};

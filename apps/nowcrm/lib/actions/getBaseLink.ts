"use server";

import { env } from "../config/envConfig";

export async function getBaseLink(): Promise<string> {
	return env.CRM_BASE_URL;
}

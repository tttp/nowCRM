"use server";

import { env } from "@/lib/config/envConfig";

export async function getCrmVersion(_locale = "en"): Promise<string> {
	return env.NT_STACK_VERSION;
}

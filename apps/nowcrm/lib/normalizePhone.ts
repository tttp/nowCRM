// utils/normalizePhone.ts
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

/**
 * Normalize a phone number to E.164 format if valid.
 * Accepts input like: +41..., 0041..., 41..., etc.
 * Returns: { normalized, isValidPhone, error } or null if invalid
 */
export function normalizePhone(input: string): {
	normalized: string | null;
	isValidPhone: boolean;
	error: string | null;
} {
	let cleaned = input.trim().replace(/[^\d+]/g, "");

	// Convert 00... to +...
	if (cleaned.startsWith("00")) {
		cleaned = `+${cleaned.slice(2)}`;
	}

	// Add + if it starts with digits and no +
	if (!cleaned.startsWith("+")) {
		cleaned = `+${cleaned}`;
	}

	try {
		const phone = parsePhoneNumberFromString(cleaned);
		if (phone?.isValid()) {
			return {
				normalized: phone.format("E.164"),
				isValidPhone: true,
				error: null,
			};
		}
		return {
			normalized: null,
			isValidPhone: false,
			error: "Invalid phone number",
		};
	} catch (_e) {
		return {
			normalized: null,
			isValidPhone: false,
			error: "Invalid phone number format",
		};
	}
}

// contactsapp/lib/actions/profile/editProfile.ts
"use server";

import crypto from "node:crypto";
import { usersService } from "@nowcrm/services/server";
import { encryptTotpSecret } from "./encryption-helpers";
import { auth } from "@/auth";

/**
 * Action to upload an image using the UserService.
 * @param formData FormData containing the file to upload.
 * @returns Promise resolving to the URL of the uploaded media file.
 * @throws Propagates errors from the service.
 */
export async function uploadImage(formData: FormData): Promise<string> {
	const files = formData.getAll("files") as File[];
	const userIdRaw = formData.get("userId");
	if (!userIdRaw) {
		throw new Error("uploadImage: missing userId in formData");
	}
	const userId = Number(userIdRaw);
	const session = await auth();
	if (!session) {
		throw new Error("uploadImage: missing session");
	}

	const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
	for (const file of files) {
		if (!allowedMimeTypes.includes(file.type)) {
			throw new Error(
				`uploadImage: invalid file type "${file.type}". Only JPG and PNG allowed.`,
			);
		}
	}

	const result = await usersService.uploadProfilePicture(files, userId, session.jwt);
	const assets = result.data;

	// 3. Return the first URL or a fallback
	if (assets && assets.length > 0) {
		return assets[0].url;
	}
	return "placeholder.png";
}

/**
 * Action to update user data using the UserService.
 * @param data Object containing userId and update data (username, email, image).
 * @returns Promise resolving when the update is complete.
 * @throws Propagates errors from the service.
 */
// Assuming these functions already exist in your file
// If not, you'll need to implement them as well
export async function updateUser(data: {
	userId: number;
	username?: string;
	email?: string;
	is2FAEnabled?: boolean;
	totpSecret?: string | null;
}): Promise<void> {
	try {
		const session = await auth();
		if (!session) {
			throw new Error("updateUser: missing session");
		}
		const { userId, ...updateFields } = data;

		if (!userId) {
			throw new Error("User ID is required");
		}

		// Map the data for the service call
		const servicePayload: {
			username?: string;
			email?: string;
			is2FAEnabled?: boolean;
			totpSecret?: string | null;
		} = {};

		if (updateFields.username) servicePayload.username = updateFields.username;
		if (updateFields.email) servicePayload.email = updateFields.email;

		// Handle 2FA fields
		if (typeof updateFields.is2FAEnabled === "boolean") {
			servicePayload.is2FAEnabled = updateFields.is2FAEnabled;
		}

		// Only save totpSecret if 2FA is being enabled and secret is provided
		if (updateFields.is2FAEnabled && updateFields.totpSecret) {
			// Encrypt the TOTP secret before storing
			servicePayload.totpSecret = encryptTotpSecret(updateFields.totpSecret);
		} else if (updateFields.is2FAEnabled === false) {
			// Clear the secret when disabling 2FA
			servicePayload.totpSecret = null;
		}

		if (Object.keys(servicePayload).length === 0) {
			console.log("Action: No data to update.");
			return; // Nothing to do
		}

		// Call the service method
		await usersService.updateProfile(userId, servicePayload, session.jwt);
	} catch (error) {
		console.error("Action Error: updateUser failed.", error);
		throw error;
	}
}

/**
 * Generates a secure random TOTP secret for two-factor authentication
 * @returns A base32 encoded string to be used as TOTP secret
 */
export async function generateTotpSecret(): Promise<string> {
	// Generate 20 random bytes (160 bits)
	const buffer = crypto.randomBytes(20);

	// Convert to base32 encoding (standard for TOTP)
	return base32Encode(buffer);
}

/**
 * Base32 encoding function following RFC 4648
 * @param buffer - The buffer to encode
 * @returns The base32 encoded string
 */
function base32Encode(buffer: Buffer): string {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	let result = "";
	let bits = 0;
	let value = 0;

	for (let i = 0; i < buffer.length; i++) {
		value = (value << 8) | buffer[i];
		bits += 8;

		while (bits >= 5) {
			result += alphabet[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}

	if (bits > 0) {
		result += alphabet[(value << (5 - bits)) & 31];
	}

	return result;
}

export async function verifyTotpToken(
	secret: string,
	token: string,
): Promise<boolean> {
	// Get the current timestamp in seconds
	const now = Math.floor(Date.now() / 1000);

	// TOTP uses 30-second time steps
	const timeStep = 30;

	// Check the current time window and adjacent windows for clock skew
	for (let i = -1; i <= 1; i++) {
		const counter = Math.floor(now / timeStep) + i;
		const expectedToken = generateTotpToken(secret, counter);

		if (expectedToken === token) {
			return true;
		}
	}

	return false;
}

/**
 * Generates a TOTP token for a given secret and counter
 * @param secret - The TOTP secret
 * @param counter - The time counter
 * @returns The 6-digit TOTP code
 */
function generateTotpToken(secret: string, counter: number): string {
	// Decode the base32 secret
	const decodedSecret = base32Decode(secret); // returns Buffer ✅

	// Convert counter to buffer
	const buffer = Buffer.alloc(8);
	let tempCounter = counter;
	for (let i = 0; i < 8; i++) {
		buffer[7 - i] = tempCounter & 0xff;
		tempCounter = tempCounter >> 8;
	}

	// ✅ Use decodedSecret directly
	const hmac = crypto.createHmac("sha1", new Uint8Array(decodedSecret));
	hmac.update(new Uint8Array(buffer)); // 🔧 already fixed
	const hmacResult = hmac.digest();

	// Dynamic truncation
	const offset = hmacResult[hmacResult.length - 1] & 0xf;
	const code =
		((hmacResult[offset] & 0x7f) << 24) |
		((hmacResult[offset + 1] & 0xff) << 16) |
		((hmacResult[offset + 2] & 0xff) << 8) |
		(hmacResult[offset + 3] & 0xff);

	return (code % 1_000_000).toString().padStart(6, "0");
}

/**
 * Decodes a base32 string to a buffer
 * @param str - The base32 encoded string
 * @returns The decoded array of numbers
 */
function base32Decode(str: string): Buffer {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const cleaned = str.toUpperCase().replace(/[^A-Z2-7]/g, "");

	let bits = 0;
	let value = 0;
	const bytes: number[] = [];

	for (let i = 0; i < cleaned.length; i++) {
		const v = alphabet.indexOf(cleaned[i]);
		if (v < 0) continue;

		value = (value << 5) | v;
		bits += 5;

		while (bits >= 8) {
			bytes.push((value >>> (bits - 8)) & 0xff);
			bits -= 8;
		}
	}

	return Buffer.from(bytes);
}

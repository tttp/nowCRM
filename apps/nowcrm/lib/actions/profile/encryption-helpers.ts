import crypto from "node:crypto";
import { env } from "@/lib/config/envConfig";

/**
 * Encrypts the TOTP secret for secure storage
 * @param secret - The plain TOTP secret
 * @returns The encrypted secret
 */
export function encryptTotpSecret(secret: string): string {
	const encryptionKey =
		env.CRM_TOTP_ENCRYPTION_KEY || "your-32-character-secret-key-here!";

	// 🔐 Prepare a 32-byte AES key from the env string
	const keySource = new TextEncoder().encode(encryptionKey); // Uint8Array
	const keyBytes = new Uint8Array(32);
	keyBytes.set(keySource.subarray(0, 32)); // pad or truncate as needed

	// 🔐 Initialization Vector: 16 bytes, cast to Uint8Array
	const ivBuffer = crypto.randomBytes(16);
	const iv = new Uint8Array(ivBuffer); // ✅ Fix here

	// 🔐 Create Cipher
	const cipher = crypto.createCipheriv("aes-256-cbc", keyBytes, iv);

	let encrypted = cipher.update(secret, "utf8", "hex");
	encrypted += cipher.final("hex");

	// 🔐 Return iv + ciphertext
	return `${ivBuffer.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts the TOTP secret for verification
 * @param encryptedSecret - The encrypted secret from database
 * @returns The decrypted secret
 */
export function decryptTotpSecret(encryptedSecret: string): string {
	const encryptionKey =
		env.CRM_TOTP_ENCRYPTION_KEY || "your-32-character-secret-key-here!";

	const keySource = new TextEncoder().encode(encryptionKey);
	const keyBytes = new Uint8Array(32);
	keyBytes.set(keySource.subarray(0, 32));

	const [ivHex, encrypted] = encryptedSecret.split(":");
	const iv = new Uint8Array(Buffer.from(ivHex, "hex")); // ✅ TS-safe BinaryLike

	const decipher = crypto.createDecipheriv("aes-256-cbc", keyBytes, iv);

	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}

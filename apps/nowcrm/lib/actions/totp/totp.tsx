"use server";

import QRCode from "qrcode";

export const generateSecret = (_email: string) => {
	const secret = "11111";
	return secret;
};

export const generateQRCode = async (otpauth_url: string) => {
	return await QRCode.toDataURL(otpauth_url);
};

export const verifyOtp = (_secret: string, _otp: string) => {
	return true;
};

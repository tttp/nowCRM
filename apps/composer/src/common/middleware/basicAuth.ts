import type { NextFunction, Request, Response } from "express";
import { env } from "../utils/envConfig";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Basic ")) {
		res.setHeader("WWW-Authenticate", 'Basic realm="Access to the site"');
		return res
			.status(401)
			.json({ message: "Missing or invalid Authorization header" });
	}

	const base64Credentials = authHeader.split(" ")[1];
	const credentials = Buffer.from(base64Credentials, "base64").toString(
		"ascii",
	);
	const [username, password] = credentials.split(":");

	const validUsername = env.COMPOSER_BASIC_AUTH_USERNAME || "admin";
	const validPassword = env.COMPOSER_BASIC_AUTH_PASSWORD || "admin";

	if (username === validUsername && password === validPassword) {
		return next();
	}

	res.setHeader("WWW-Authenticate", 'Basic realm="Access to the site"');
	res.status(401).json({ message: "Invalid credentials" });
};

export default basicAuth;

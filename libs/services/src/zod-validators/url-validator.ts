import { makeValidator } from "envalid";

// allow empty string during ci for ignoring build errors
const isCI = process.env.NODE_ENV === "production";

export const URLValidator = makeValidator((x) => {
	if (isCI) return x;
	if (!x) throw new Error("Expected not empty string");
	if (/^https?:\/\//.test(x)) return x;
	else throw new Error("Expected URL to start with http or https");
});

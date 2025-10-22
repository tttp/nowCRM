import { bool, cleanEnv, makeValidator, str, testOnly } from "envalid";

// this needed is because nodejs env handler inside nextjs is wroking not how envalid expect
const processEnv = {
	NODE_ENV: process.env.NODE_ENV || "",
	CRM_BASE_URL: process.env.CRM_BASE_URL || "",
	AUTH_SECRET: process.env.AUTH_SECRET || "",
	AUTH_URL: process.env.AUTH_URL || "",
	AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || false,
	CRM_STRAPI_API_URL: process.env.CRM_STRAPI_API_URL || "",
	CRM_STRAPI_API_TOKEN: process.env.CRM_STRAPI_API_TOKEN || "",
	CRM_COMPOSER_API_URL: process.env.CRM_COMPOSER_API_URL || "",
	CRM_DAL_API_URL: process.env.CRM_DAL_API_URL || "",
	CRM_TOTP_ENCRYPTION_KEY: process.env.CRM_TOTP_ENCRYPTION_KEY || "",
	NT_STACK_VERSION: process.env.NT_STACK_VERSION || "",
	TEST_RUN: process.env.TEST_RUN || false,
	S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || "",
	S3_SECRET_KEY: process.env.S3_SECRET_KEY || "",
	S3_ENDPOINT: process.env.S3_ENDPOINT || "",
	S3_BUCKET: process.env.S3_BUCKET || "",
	S3_PUBLIC_URL_BASE: process.env.S3_PUBLIC_URL_BASE || "",
};

// allow empty string during ci for ignoring build errors
const isCI = process.env.NODE_ENV === "production";

const NotEmptyStringValidator = makeValidator((x) => {
	if (x || isCI) return x;
	else throw new Error("Expected not empty string");
});

const URLValidator = makeValidator((x) => {
	if (isCI) return x;
	if (!x) throw new Error("Expected not empty string");
	if (/^https?:\/\//.test(x)) return x;
	else throw new Error("Expected URL to start with http or https");
});

export const env = cleanEnv(processEnv, {
	NODE_ENV: NotEmptyStringValidator({
		devDefault: testOnly("test"),
		choices: ["development", "production", "test"],
	}),
	CRM_BASE_URL: URLValidator({ devDefault: testOnly("http://localhost:3000") }),
	// this 2 env do not have prefix crm cause next-auth by default detect them like this
	AUTH_SECRET: NotEmptyStringValidator({
		devDefault: testOnly("pZsHmI9P7wcs03/BEuFtMxi9HbSuyCwyknuyx7BIads="),
	}),
	AUTH_URL: URLValidator({
		devDefault: testOnly("http://localhost:3000/api/auth"),
	}),

	AUTH_TRUST_HOST: bool({ devDefault: testOnly(false) }),

	TEST_RUN: bool({ devDefault: testOnly(false) }),
	// envs for strapi connection
	CRM_STRAPI_API_URL: URLValidator({
		devDefault: testOnly("http://localhost:1337/api/"),
	}),
	CRM_COMPOSER_API_URL: URLValidator({
		devDefault: testOnly("http://localhost:3020/"),
	}),
	CRM_STRAPI_API_TOKEN: NotEmptyStringValidator(),
	CRM_TOTP_ENCRYPTION_KEY: NotEmptyStringValidator(),
	NT_STACK_VERSION: NotEmptyStringValidator(),
	CRM_DAL_API_URL: URLValidator({
		devDefault: testOnly("http://localhost:6001/api/"),
	}),
	// ✅ Optional S3 settings (no error if not set)
	S3_ACCESS_KEY: str({ default: undefined }),
	S3_SECRET_KEY: str({ default: undefined }),
	S3_ENDPOINT: str({ default: undefined }),
	S3_BUCKET: str({ default: undefined }),
	S3_PUBLIC_URL_BASE: str({ default: undefined }),
});

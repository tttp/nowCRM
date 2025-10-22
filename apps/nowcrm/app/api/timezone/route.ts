// app/api/timezone/route.ts
import { type NextRequest, NextResponse } from "next/server";

function isValidTimeZone(tz: string): boolean {
	try {
		// Throws on invalid IANA names
		new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(0);
		return true;
	} catch {
		return false;
	}
}

export async function POST(req: NextRequest) {
	const { tz } = await req.json().catch(() => ({ tz: "" }));
	if (typeof tz !== "string" || !isValidTimeZone(tz)) {
		return NextResponse.json(
			{ ok: false, error: "invalid timezone" },
			{ status: 400 },
		);
	}

	const res = NextResponse.json({ ok: true });
	res.cookies.set("tz", tz, {
		path: "/",
		httpOnly: false, // keep false if you also read it on the client
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 365, // 1 year
	});
	return res;
}

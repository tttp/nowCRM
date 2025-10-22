// app/_components/SetTimezoneCookie.tsx
"use client";

import { useEffect } from "react";

function getCookie(name: string) {
	return document.cookie
		.split("; ")
		.find((c) => c.startsWith(`${name}=`))
		?.split("=")[1];
}

export default function SetTimezoneCookie() {
	useEffect(() => {
		const cookieName = "tz";
		if (getCookie(cookieName)) return;

		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

		// Fire and forget
		fetch("/api/timezone", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tz }),
			keepalive: true, // helps on fast navigations/unloads
		}).catch(() => {});
	}, []);

	return null;
}

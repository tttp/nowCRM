import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const key = searchParams.get("key");

	if (!key) {
		return new NextResponse("Missing key", { status: 400 });
	}

	const swiftUrl = `${process.env.S3_PUBLIC_URL_BASE}/${process.env.S3_BUCKET}/${encodeURIComponent(key)}`;

	try {
		const swiftRes = await fetch(swiftUrl);

		if (!swiftRes.ok) {
			return new NextResponse("Image not found", { status: swiftRes.status });
		}

		const contentType =
			swiftRes.headers.get("content-type") || "application/octet-stream";
		const buffer = await swiftRes.arrayBuffer();

		return new NextResponse(Buffer.from(buffer), {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": "inline",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (err) {
		console.error("Proxy error", err);
		return new NextResponse("Server error", { status: 500 });
	}
}

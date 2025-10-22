import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
	region: "us-east-1",
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_KEY!,
	},
	forcePathStyle: true,
});

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get("file") as File;

	if (!file || typeof file === "string") {
		return NextResponse.json({ error: "No file provided" }, { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const date = new Date().toISOString().split("T")[0];
	const filename = `${date}-${file.name}`;

	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: filename,
				Body: buffer,
				ContentType: file.type,
				ACL: "public-read",
			}),
		);

		const publicUrl = `${process.env.CRM_BASE_URL}/api/email-image?key=${encodeURIComponent(filename)}`;

		return NextResponse.json({ url: publicUrl }, { status: 200 });
	} catch (error) {
		console.error("S3 upload failed:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMessages } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RouteConfig } from "@/lib/config/RoutesConfig";

interface SessionUser {
	username: string;
	email: string;
	image: { url?: string };
	role: any;
	strapi_id: number;
	twoFARequired?: boolean;
	totpSecret?: string;
}

interface ProfileCardProps {
	user: SessionUser;
}

export default function ProfileCard({ user }: ProfileCardProps) {
	const t = useMessages();

	return (
		<Card className="w-full">
			<CardHeader className="pb-4">
				<CardTitle>{t.UserInfo.card.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-start gap-6 md:flex-row">
					<div className="relative h-32 w-32 overflow-hidden rounded-full border">
						<Image
							src={user.image?.url || "/placeholder.svg"}
							alt={`${user.username}'s profile picture`}
							fill
							unoptimized
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<h2 className="scroll-m-20 font-semibold text-2xl tracking-tight">
								{user.username}
							</h2>
							<Badge variant="outline" className="ml-2">
								{user.role?.name ?? t.UserInfo.card.defaultRole}
							</Badge>
						</div>
						<p className="text-muted-foreground text-sm">
							{user.username} &lt;{user.email}&gt;
						</p>
						<Link href={RouteConfig.user.edit_profile}>
							<Button variant="outline" className="mt-4">
								{t.UserInfo.editProfile}
							</Button>
						</Link>
					</div>
				</div>

				<Separator className="my-6" />

				<div className="space-y-6">
					<InfoRow label={t.common.labels.username} value={user.username} />
					<InfoRow label={t.common.labels.email} value={user.email} />
					<InfoRow
						label={t.UserInfo.card.role}
						value={user.role?.name ?? "N/A"}
					/>
					<InfoRow
						label={t.UserInfo.card.strapiId}
						value={user.strapi_id.toString()}
					/>
					<TwoFARow
						label={t.UserInfo.card.twoFA}
						value={user.twoFARequired ?? false}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<h3 className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				{label}
			</h3>
			<p className="mt-2 text-muted-foreground text-sm">{value}</p>
		</div>
	);
}

function TwoFARow({ label, value }: { label: string; value: boolean }) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				{label}
			</h3>
			<Switch checked={value} disabled />
		</div>
	);
}

// contactsapp/app/[locale]/(forms)/forms/share/[slug]/page.tsx
// URL forms/share/[slug]?key1=value1&key2=value2
// Embedding via URL params:, if ?isEmbedded=1 , hide bottom navigation links

import { notFound } from "next/navigation";
import { Suspense } from "react";
import BottomNavigationLinks from "@/components/bottomBar/bottomNavigationLinks";
import FormShareClient from "@/components/forms/form-share-client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<{ locale: string; slug: string }>;
	searchParams: Promise<Record<string, string>>;
}) {
	try {
		const { slug } = await params;
		const urlParams = await searchParams;

		const isEmbedded = urlParams?.isEmbedded === "1";

		return (
			<>
				<main className="grow overflow-auto">
					<div className={cn("container", isEmbedded ? "p-0" : "py-8")}>
						<Suspense fallback={<FormSkeleton isEmbedded={isEmbedded} />}>
							<FormShareClient queryId={slug} urlParams={urlParams} />
						</Suspense>
					</div>
				</main>

				{/* Outside of <main>, conditionally render */}
				{!isEmbedded && <BottomNavigationLinks />}
			</>
		);
	} catch (error) {
		console.error("Error loading form:", error);
		return notFound();
	}
}

function FormSkeleton({ isEmbedded }: { isEmbedded: boolean }) {
	return (
		<div className="space-y-6">
			<Skeleton className="mx-auto h-8 w-3/4" />
			<Skeleton className="h-24 w-full" />
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-10 w-full" />
					</div>
				))}
			</div>
			<div className="flex justify-end">
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Important: keep this in skeleton to mimic layout, but still conditional */}
			{!isEmbedded && <BottomNavigationLinks />}
		</div>
	);
}

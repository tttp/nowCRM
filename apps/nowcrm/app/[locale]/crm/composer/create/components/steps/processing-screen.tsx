"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RouteConfig } from "@/lib/config/RoutesConfig";

interface ProcessingScreenProps {
	onSubmit: () => Promise<string | null>;
	onBack: () => void;
}

export default function ProcessingScreen({
	onSubmit,
	onBack,
}: ProcessingScreenProps) {
	const t = useMessages();
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [compositionId, setCompositionId] = useState<string | null>(null);
	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const compositionId = await onSubmit();
			setCompositionId(compositionId);
			setIsComplete(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<h2 className="mb-6 font-bold text-2xl">
				{t.Composer.processingScreen.stepTitle}
			</h2>

			<Card className="mb-6 p-6 text-center">
				{isComplete ? (
					<div className="flex flex-col items-center">
						<CheckCircle className="mb-4 h-16 w-16 text-green-500" />
						<h3 className="mb-2 font-semibold text-xl">
							{t.Composer.processingScreen.submittedTitle}
						</h3>
						<p className="mb-4 text-muted-foreground">
							{t.Composer.processingScreen.submittedDescription}
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center">
						<div className="mb-4">
							{isSubmitting ? (
								<Loader2 className="h-16 w-16 animate-spin text-primary" />
							) : (
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
									<span className="text-2xl">4</span>
								</div>
							)}
						</div>
						<h3 className="mb-2 font-semibold text-xl">
							{t.Composer.processingScreen.readyTitle}
						</h3>
						<p className="mb-4 text-muted-foreground">
							{t.Composer.processingScreen.readyDescription}
						</p>
					</div>
				)}
			</Card>

			<div className="flex justify-between">
				{!isComplete && (
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isSubmitting}
					>
						{t.common.actions.back}
					</Button>
				)}

				{isComplete ? (
					<div className="flex w-full justify-between">
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								{t.Composer.processingScreen.createNew}
							</Button>
							<Button
								variant="outline"
								onClick={() => router.push(RouteConfig.composer.base)}
							>
								{t.Composer.channelContent.viewCompositions}
							</Button>
						</div>
						<Button
							onClick={() =>
								router.push(RouteConfig.composer.single(Number(compositionId)))
							}
						>
							{t.Composer.channelContent.viewComposition}
						</Button>
					</div>
				) : (
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className={!isSubmitting ? "ml-auto" : "w-full"}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t.Composer.processingScreen.processing}
							</>
						) : (
							t.Composer.processingScreen.submitButton
						)}
					</Button>
				)}
			</div>
		</div>
	);
}

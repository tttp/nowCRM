// contactsapp/app/[locale]/(auth)/auth/verify-otp/components/verifyOtpFom.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaClock, FaKey, FaShieldAlt } from "react-icons/fa";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RouteConfig } from "@/lib/config/RoutesConfig";

export function VerifyOtpForm() {
	const t = useMessages().Auth;
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(30);

	// Countdown timer for TOTP (30-second window)
	useEffect(() => {
		const timer = setInterval(() => {
			const now = Math.floor(Date.now() / 1000);
			const remaining = 30 - (now % 30);
			setTimeRemaining(remaining);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const totpSchema = z.object({
		otp: z
			.string()
			.length(6, "Verification code must be exactly 6 digits")
			.regex(/^[0-9]+$/, "Verification code must contain only numbers"),
	});

	const totpForm = useForm<z.infer<typeof totpSchema>>({
		resolver: zodResolver(totpSchema),
		defaultValues: {
			otp: "",
		},
	});

	async function onSubmitTotp(values: z.infer<typeof totpSchema>) {
		setIsSubmitting(true);

		try {
			const { verifyOtpAction } = await import("./verifyOtpAction");
			// await verifyOtpAction(values);

			const result = await verifyOtpAction(values);

			if (result?.redirectTo) {
				router.push(result.redirectTo);
			}

			toast.success("Login successful! Welcome back.");
		} catch (error: any) {
			console.error(`Second factor verification failed: ${error.message}`);
			toast.error(error.message || "Verification failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...totpForm}>
			<form
				onSubmit={totpForm.handleSubmit(onSubmitTotp)}
				className="grid gap-4"
			>
				{/* Info banner */}
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-start gap-3">
							<Info className="mt-0.5 h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle className="text-sm">
									Second factor required
								</CardTitle>
								<CardDescription className="text-sm">
									Your password was correct. Now enter the 6-digit code from
									your authenticator app to complete login.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
				</Card>

				<FormField
					control={totpForm.control}
					name="otp"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="flex items-center justify-between">
								<span className="flex items-center">
									<FaShieldAlt className="mr-2 text-primary" />
									{t.VerifyOtp.actions.verify}
								</span>
								<span className="flex items-center text-muted-foreground text-sm">
									<FaClock className="mr-1" />
									{timeRemaining}s
								</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter 6-digit code"
									{...field}
									maxLength={6}
									inputMode="numeric"
									autoComplete="one-time-code"
									className="text-center font-mono text-lg tracking-widest"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting || totpForm.formState.isValid === false}
				>
					<FaKey className="mr-2 h-4 w-4" />
					{isSubmitting ? "Verifying..." : "Complete Login"}
				</Button>

				<div className="text-center">
					<p className="mt-4 text-muted-foreground text-sm">
						<span>Code refreshes every 30 seconds • </span>
					</p>
					<p className="mt-2 text-muted-foreground text-sm">
						<Link
							href={RouteConfig.auth.login}
							className="font-medium text-primary hover:underline"
						>
							{t.Unauthorized.returnToLogin}
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}

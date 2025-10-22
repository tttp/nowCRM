"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	generateTotpSecret,
	updateUser,
	uploadImage,
} from "@/lib/actions/profile/editProfile";
import { RouteConfig } from "@/lib/config/RoutesConfig";

interface SessionUser {
	username: string;
	email: string;
	image: { url?: string };
	role: { name?: string };
	strapi_id: number;
	twoFARequired?: boolean;
	totpSecret?: string;
}

interface EditProfileFormProps {
	user: SessionUser;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showTotpSecret, setShowTotpSecret] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error" | "info";
		message: string;
	} | null>(null);

	const t = useMessages();
	const router = useRouter();

	const formSchema = z.object({
		username: z.string().min(3, t.UserInfo.form.usernameSchema),
		email: z.string().email(t.UserInfo.form.emailSchema),
		is2FAEnabled: z.boolean(),
		totpSecret: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: user.username || "",
			email: user.email || "",
			is2FAEnabled: Boolean(user.twoFARequired), // Ensure it's a boolean
			totpSecret: user.totpSecret || "",
		},
	});

	// Reset form when user prop changes (handles async data loading)
	useEffect(() => {
		console.log("User data received:", {
			username: user.username,
			email: user.email,
			is2FAEnabled: user.twoFARequired,
			totpSecret: user.totpSecret,
		});

		form.reset({
			username: user.username || "",
			email: user.email || "",
			is2FAEnabled: Boolean(user.twoFARequired),
			totpSecret: user.totpSecret || "",
		});
	}, [user, form]);

	const is2FAEnabled = form.watch("is2FAEnabled");
	const totpSecret = form.watch("totpSecret");

	const hasChanges = form.formState.isDirty || imageFile !== null;

	// Generate QR code URL when 2FA is enabled and we have a secret
	useEffect(() => {
		if (is2FAEnabled && totpSecret) {
			const issuer = "nowCRM";
			const accountName = `${issuer}:${user.email}`;
			const otpauthUrl = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${totpSecret}&issuer=${encodeURIComponent(issuer)}`;
			setQrCodeUrl(
				`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`,
			);
		} else {
			setQrCodeUrl("");
		}
	}, [is2FAEnabled, totpSecret, user.email]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;

		if (file) {
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
			if (!allowedTypes.includes(file.type)) {
				toast.error("Invalid file type. Please upload a JPG or PNG image.");
				setImageFile(null);
				setImagePreview(undefined);
				return;
			}

			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setImageFile(null);
			setImagePreview(undefined);
		}
	};

	const handleGenerateNewSecret = async () => {
		try {
			const newSecret = await generateTotpSecret();
			form.setValue("totpSecret", newSecret);
		} catch (error) {
			console.error("Failed to generate new TOTP secret:", error);
		}
	};

	const handle2FAToggle = async (enabled: boolean) => {
		if (enabled && !totpSecret) {
			// Generate new secret when enabling 2FA for the first time
			try {
				const newSecret = await generateTotpSecret();
				form.setValue("totpSecret", newSecret);
			} catch (error) {
				console.error("Failed to generate TOTP secret:", error);
				return;
			}
		}
		form.setValue("is2FAEnabled", enabled);
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setSubmitStatus({
				type: "success",
				message: "Secret copied to clipboard!",
			});
			setTimeout(() => setSubmitStatus(null), 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			let newImageUrl: string | undefined;

			// Upload image if selected
			if (imageFile) {
				console.log("Uploading new image...");
				const formData = new FormData();
				formData.append("files", imageFile);
				formData.append("userId", user.strapi_id.toString());

				newImageUrl = await uploadImage(formData);
				console.log("Image uploaded, URL:", newImageUrl);
			}

			// Prepare update payload
			const updateData: {
				userId: number;
				username?: string;
				email?: string;
				is2FAEnabled?: boolean;
				totpSecret?: string;
			} = {
				userId: user.strapi_id,
				username: values.username,
				email: values.email,
				is2FAEnabled: values.is2FAEnabled,
				totpSecret: values.totpSecret,
			};

			if (Object.keys(updateData).length > 1) {
				console.log("Updating user profile with:", updateData);
				await updateUser(updateData);

				setSubmitStatus({
					type: "success",
					message: t.UserInfo.status.succes,
				});
				router.push(RouteConfig.user.profile);
			} else {
				setSubmitStatus({
					type: "info",
					message: t.UserInfo.status.info,
				});
			}
		} catch (err) {
			console.error("Error updating profile:", err);
			setSubmitStatus({
				type: "error",
				message: err instanceof Error ? err.message : t.UserInfo.status.error,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading state if user data is incomplete
	if (!user || user.strapi_id === undefined) {
		return <div>Loading user data...</div>;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<h2 className="font-bold text-2xl tracking-tight">
					{t.UserInfo.editProfile}
				</h2>

				{/* Profile picture section */}
				<div className="space-y-2">
					<h3 className="font-medium text-lg">{t.UserInfo.form.subtitle}</h3>
					<p className="text-muted-foreground text-sm">
						{t.UserInfo.form.description}
					</p>
				</div>
				<div className="flex items-center gap-6">
					<div className="relative h-32 w-32 overflow-hidden rounded-full border">
						<Image
							src={imagePreview || user.image?.url || "/placeholder.svg"}
							alt="Profile"
							fill
							unoptimized
							className="object-cover"
							priority={!imagePreview}
							key={imagePreview || user.image?.url}
						/>
					</div>
					<FormItem>
						<FormLabel
							htmlFor="profile-picture"
							className="font-medium text-sm leading-none"
						>
							{t.UserInfo.form.changePictureLabel}
						</FormLabel>
						<FormControl>
							<Input
								id="profile-picture"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								disabled={isSubmitting}
							/>
						</FormControl>
						<p className="text-muted-foreground text-sm">
							{t.UserInfo.form.pictureNote}
						</p>
						<FormMessage />
					</FormItem>
				</div>

				{/* Username & Email fields */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor="username"
								className="font-medium text-sm leading-none"
							>
								{t.common.labels.username}
							</FormLabel>
							<FormControl>
								<Input id="username" {...field} disabled={isSubmitting} />
							</FormControl>
							<p className="text-muted-foreground text-sm">
								{t.UserInfo.form.usernameDescription}
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor="email"
								className="font-medium text-sm leading-none"
							>
								{t.common.labels.email}
							</FormLabel>
							<FormControl>
								<Input
									id="email"
									type="email"
									{...field}
									disabled={isSubmitting}
								/>
							</FormControl>
							<p className="text-muted-foreground text-sm">
								{t.UserInfo.form.emailDescription}
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Two-Factor Authentication Section */}
				<div className="space-y-4 border-t pt-6">
					<h3 className="font-medium text-lg">Security Settings</h3>

					<FormField
						control={form.control}
						name="is2FAEnabled"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="font-medium text-base">
										Two-Factor Authentication
									</FormLabel>
									<p className="text-muted-foreground text-sm">
										Add an extra layer of security to your account using an
										authenticator app
									</p>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											handle2FAToggle(checked);
										}}
										disabled={isSubmitting}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* TOTP Secret and QR Code - only show when 2FA is enabled */}
					{is2FAEnabled && (
						<div className="space-y-4 rounded-lg border bg-muted/50 p-4">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">Authenticator Setup</h4>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleGenerateNewSecret}
									disabled={isSubmitting}
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									Generate New Secret
								</Button>
							</div>

							<div className="space-y-2">
								<p className="text-muted-foreground text-sm">
									<strong>Setting up 2FA:</strong>
								</p>
								<ol className="ml-4 list-decimal space-y-1 text-muted-foreground text-sm">
									<li>
										If you previously had 2FA enabled,{" "}
										<strong>delete the old "nowCRM" entry</strong> from your
										authenticator app first
									</li>
									<li>
										Scan the QR code below with your authenticator app (Google
										Authenticator, Authy, etc.)
									</li>
									<li>Or manually enter the secret key shown below</li>
									<li>Save your changes to complete the setup</li>
									<li>
										⚠️ Important: Each time you generate a new secret, you must
										remove the old entry from your authenticator app and add the
										new one.
									</li>
								</ol>
							</div>

							{/* QR Code */}
							{qrCodeUrl && (
								<div className="flex justify-center">
									<div className="rounded-lg border bg-white p-4">
										<Image
											src={qrCodeUrl}
											alt="2FA QR Code"
											width={200}
											height={200}
											unoptimized
										/>
									</div>
								</div>
							)}

							{/* Secret Key */}
							<FormField
								control={form.control}
								name="totpSecret"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-medium text-sm">
											Secret Key (Manual Entry)
										</FormLabel>
										<div className="flex gap-2">
											<FormControl>
												<Input
													{...field}
													type={showTotpSecret ? "text" : "password"}
													readOnly
													className="font-mono text-sm"
												/>
											</FormControl>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => setShowTotpSecret(!showTotpSecret)}
											>
												{showTotpSecret ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => copyToClipboard(field.value || "")}
											>
												<Copy className="h-4 w-4" />
											</Button>
										</div>
										<p className="text-muted-foreground text-xs">
											Keep this secret safe. You'll need it to set up your
											authenticator app.
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>

				{/* Submission status */}
				{submitStatus && (
					<div
						className={`rounded p-3 font-medium text-sm ${
							submitStatus.type === "error"
								? "bg-red-100 text-red-700"
								: submitStatus.type === "success"
									? "bg-green-100 text-green-700"
									: "bg-blue-100 text-blue-700"
						}`}
					>
						{submitStatus.message}
					</div>
				)}

				{/* Submit button */}
				<div className="flex justify-between gap-4 pt-4">
					<Button
						variant="ghost"
						size="sm"
						className="ml-2"
						onClick={() => router.back()}
					>
						<ArrowLeft className="mr-1 h-4 w-4" />
						{t.common.actions.back}
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting || !hasChanges}
						className="font-medium"
					>
						{isSubmitting
							? t.common.status.saving
							: t.common.actions.saveChanges}
					</Button>
				</div>
			</form>
		</Form>
	);
}

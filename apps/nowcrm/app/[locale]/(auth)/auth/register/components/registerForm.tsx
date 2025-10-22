"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
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
import { RouteConfig } from "@/lib/config/RoutesConfig";

export function RegisterUserForm() {
	const t = useMessages();
	const router = useRouter();

	const formSchema = z.object({
		username: z.string().min(5, t.Auth.Register.form.usernameSchema),
		email: z.string().email(t.Auth.Register.form.emailSchema),
		password: z
			.string()
			.min(8, t.Auth.Register.form.passwordSchema1)
			.regex(/[A-Z]/, t.Auth.Register.form.passwordSchema2)
			.regex(/[a-z]/, t.Auth.Register.form.passwordSchema3)
			.regex(/[0-9]/, t.Auth.Register.form.passwordSchema4),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { default: toast } = await import("react-hot-toast");
		const { registerAction } = await import("./registerAction");
		try {
			const response = await registerAction(values);
			if (response.success === true && response.data) {
				toast.success(t.Auth.Register.toast.success.accountCreated);
				router.push(`${RouteConfig.auth.login}`);
			} else {
				toast.error(`${response.errorMessage}`);
			}
		} catch (error: any) {
			console.error(
				`${t.Auth.Register.toast.error.accountCreatedError} ${error.message}`,
			);
			toast.error(
				`${t.Auth.Register.toast.error.accountCreatedError} ${error.message}`,
			);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="flex items-center">
								<FaUser className="mr-2 text-primary" />{" "}
								{t.common.labels.fullName}
							</FormLabel>
							<FormControl>
								<Input
									placeholder={t.Auth.Register.form.placeholderName}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="flex items-center">
								<FaEnvelope className="mr-2 text-primary" />{" "}
								{t.common.labels.email}
							</FormLabel>
							<FormControl>
								<Input placeholder="name@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="flex items-center">
								<FaLock className="mr-2 text-primary" />{" "}
								{t.common.labels.password}
							</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t.Auth.Register.form.placeholderPassword}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					<FaUserPlus className="mr-2 h-4 w-4" />
					{t.Auth.common.register}
				</Button>
			</form>
		</Form>
	);
}

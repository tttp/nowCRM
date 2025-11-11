"use client";

import {
	AlertCircle,
	Brain,
	FileText,
	Globe,
	HelpCircle,
	Mail,
	Newspaper,
	User,
} from "lucide-react";
import { useMessages } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { aiModels, getLanguageLabel, languages } from "@nowcrm/services";

interface CompositionOverviewProps {
	form: UseFormReturn<any>;
	isEditing: boolean;
}

export function CompositionOverview({
	form,
	isEditing,
}: CompositionOverviewProps) {
	const t = useMessages().Composer.channelContent.overview;
	const referencePromptLength = form.watch("reference_prompt")?.length || 0;
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-1">
			<Card>
				<CardHeader>
					<CardTitle>{t.cardTitle}</CardTitle>
					<CardDescription>{t.cardDescription}</CardDescription>
				</CardHeader>
				<CardContent className=" grid grid-cols-1 gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="subject"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor="subject"
									className="flex items-center gap-2"
								>
									<FileText className="h-4 w-4 text-gray-400" />
									{t.fields.title}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<HelpCircle className="h-4 w-4 text-muted-foreground" />
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Subject will be used when composition is sent via
													email
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<Input
											id="subject"
											{...field}
											placeholder="Enter composition subject..."
										/>
									) : (
										<p className="text-base">{field.value}</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor="category"
									className="flex items-center gap-2"
								>
									<Newspaper className="h-4 w-4 text-gray-400" />
									{t.fields.category}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<Input
											id="category"
											{...field}
											placeholder="e.g., Marketing, Newsletter, Announcement..."
										/>
									) : (
										<p className="text-base">
											{field.value || "No category specified"}
										</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="language"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor="language"
									className="flex items-center gap-2"
								>
									<Globe className="h-4 w-4 text-gray-400" />
									{t.fields.language}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder={t.fields.selectLanguage} />
											</SelectTrigger>
											<SelectContent>
												{languages.map((language) => (
													<SelectItem
														key={`${language.label}`}
														value={language.value}
													>
														{language.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<p className="text-base">{getLanguageLabel(field.value)}</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="persona"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor="persona"
									className="flex items-center gap-2"
								>
									<User className="h-4 w-4 text-gray-400" />
									{t.fields.persona}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<Input
											id="persona"
											{...field}
											placeholder="e.g., Professional, Friendly, Casual, Expert..."
										/>
									) : (
										<p className="text-base">
											{field.value || "No persona defined"}
										</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="model"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="model" className="flex items-center gap-2">
									<Brain className="h-4 w-4 text-gray-400" />
									{t.fields.model}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder={t.fields.selectModel} />
											</SelectTrigger>
											<SelectContent>
												{aiModels.map((model) => (
													<SelectItem
														key={`${model.label}`}
														value={model.value}
													>
														{model.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<p className="text-base">{field.value}</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="add_unsubscribe"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-gray-400" />
									{t.fields.unsubscribeLabel}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<div className="flex items-start space-x-3 rounded-lg border border-primary/90 p-4">
											<Checkbox
												id="unsubscribe"
												checked={field.value}
												onCheckedChange={field.onChange}
												className="mt-0.5"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="cursor-pointer font-medium text-sm">
														{t.fields.unsubscribeCheckbox}
													</span>
												</div>
												<p className="mt-1 text-xs">
													{t.fields.unsubscribeTooltip}
												</p>
											</div>
										</div>
									) : (
										<p className="text-base">
											{field.value ? t.fields.yes : t.fields.no}
										</p>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>{t.reference.title}</CardTitle>
					<CardDescription>{t.reference.description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="reference_prompt"
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor="reference_prompt"
									className="flex items-center gap-2"
								>
									<FileText className="h-4 w-4 text-gray-500" />
									{t.reference.prompt}
								</FormLabel>
								<FormControl>
									{isEditing ? (
										<div className="space-y-2">
											<Textarea
												id="reference_prompt"
												{...field}
												rows={10}
												className="resize-none text-base leading-relaxed focus:border-transparent focus:ring-2 focus:ring-green-500"
												placeholder="Describe what you want to create. Be specific about tone, style, and key points to include..."
											/>
											{referencePromptLength === 0 && (
												<Alert>
													<AlertCircle className="h-4 w-4" />
													<AlertDescription className="text-sm">
														A detailed reference prompt helps generate better
														content. Include your goals, target audience, and
														desired tone.
													</AlertDescription>
												</Alert>
											)}
										</div>
									) : (
										<div className="min-h-[200px] rounded-lg border p-4">
											<p className="whitespace-pre-wrap text-base leading-relaxed">
												{field.value || "No reference prompt provided"}
											</p>
										</div>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

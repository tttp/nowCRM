// components/AnalyticsSection.tsx
"use client";

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/dateTimePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChannelAnalytics } from "@/lib/hooks/useChannelAnalytics";
import { DateRange, MetricConfig } from "@nowcrm/services";
import { makeCounter } from "./makeUniqueCounter";
import { getMetricDescription, renderMetricThresholds } from "./metrics";
import { DocumentId } from "@nowcrm/services";

interface AnalyticsSectionProps {
	compositionItemId: DocumentId;
	channelName: string;
	title: string;
	metrics: MetricConfig[];
}

type MetricData = MetricConfig & { value: number; good: boolean };

export function AnalyticsSection({
	compositionItemId,
	channelName,
	title,
	metrics,
}: AnalyticsSectionProps) {
	const {
		selectedRange,
		setSelectedRange,
		filteredEvents,
		dateLabel,
		customDate,
		setCustomDate,
		fetchEvents,
		isLoading,
	} = useChannelAnalytics(compositionItemId, channelName);

	useEffect(() => {
		fetchEvents();
	}, [fetchEvents, selectedRange, customDate]);

	const [displayMode, setDisplayMode] = useState<"count" | "percentage">(
		"count",
	);
	const handleRangeChange = (value: string) =>
		setSelectedRange(value as DateRange);

	if (isLoading) {
		return (
			<Card className="mt-8">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div>Loading analytics..</div>
				</CardContent>
			</Card>
		);
	}

	const counterRaw = makeCounter(filteredEvents as any[], "raw");
	const counterUnique = makeCounter(filteredEvents as any[], "unique");

	const countRaw = (types: string | string[]) => counterRaw.count(types);
	const countUnique = (types: string | string[]) => counterUnique.count(types);
	const pct = counterUnique.pct;

	const data: MetricData[] = metrics.map((m) => {
		if (displayMode === "count") {
			return { ...m, value: countRaw(m.actionTypes), good: false };
		} else {
			const num = countUnique(m.actionTypes);
			const den = countUnique(m.denominatorActionTypes!);
			const value = pct(num, den);
			const good = m.invert
				? value < (m.threshold ?? 0)
				: value > (m.threshold ?? 0);

			return { ...m, value, good };
		}
	});

	//   const overall =
	// 		data.length >= 2
	// 			? Math.round((data[0].value / (data[1].value || 1)) * 100)
	// 			: 0;

	return (
		<Card className="mt-8">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2">
						<CardTitle>{title}</CardTitle>
					</div>

					<div className="mt-2 flex items-center gap-4 sm:mt-0">
						<ToggleGroup
							type="single"
							value={displayMode}
							onValueChange={(v) =>
								v && setDisplayMode(v as "count" | "percentage")
							}
							className="grid w-[200px] grid-cols-2 rounded-md border bg-muted"
						>
							<ToggleGroupItem
								value="count"
								className="w-full rounded-sm py-1.5 text-center text-sm data-[state=on]:bg-background data-[state=off]:text-muted-foreground data-[state=on]:text-foreground"
							>
								Count
							</ToggleGroupItem>

							<ToggleGroupItem
								value="percentage"
								className="w-full rounded-sm py-1.5 text-center text-sm data-[state=on]:bg-background data-[state=off]:text-muted-foreground data-[state=on]:text-foreground"
							>
								Percentage
							</ToggleGroupItem>
						</ToggleGroup>
						<Select value={selectedRange} onValueChange={handleRangeChange}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Select range" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="yesterday">Yesterday</SelectItem>
								<SelectItem value="last7days">Last 7 days</SelectItem>
								<SelectItem value="custom">Custom date</SelectItem>
								<SelectItem value="total">Total</SelectItem>
							</SelectContent>
						</Select>

						{selectedRange === "custom" && (
							<DateTimePicker
								granularity="day"
								value={customDate}
								onChange={setCustomDate}
								placeholder="Pick a date"
								className="w-[240px]"
							/>
						)}

						<span className="text-muted-foreground text-sm">{dateLabel}</span>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div
					className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${metrics.length} gap-4`}
				>
					{data.map((m, i) => (
						<div
							key={i}
							className={`flex items-center gap-3 ${m.bgColor} rounded-lg p-4`}
						>
							<div className={`p-2 ${m.fgColor} rounded-full`}>{m.Icon}</div>
							<div className={m.textColor}>
								<div className="flex items-center gap-1">
									<p className="font-medium text-sm">{m.label}</p>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="cursor-help text-muted-foreground hover:text-foreground">
													<Info
														className="h-[14px] w-[14px]"
														strokeWidth={1.5}
													/>
												</span>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												className="max-w-[320px] overflow-auto p-2 text-xs leading-snug"
											>
												<div className="space-y-2">
													<p>{getMetricDescription(m.label)}</p>

													{renderMetricThresholds(m.label)}
												</div>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<div className="flex items-center gap-2">
									<p className="font-bold text-2xl">
										{displayMode === "count"
											? countRaw(m.actionTypes)
											: `${pct(countUnique(m.actionTypes), countUnique(m.denominatorActionTypes!))}%`}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

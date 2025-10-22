"use client";

import {
	addDays,
	addMonths,
	addYears,
	format,
	getDay,
	getDaysInMonth,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Clock,
	Filter,
	Grid2X2,
	LayoutGrid,
	LayoutList,
	Plus,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Sample event data
const events = [
	{
		id: 1,
		title: "Meeting A",
		startTime: "10:00",
		endTime: "11:30",
		date: "2025-02-03",
		color: "bg-blue-100 text-blue-900",
	},
	{
		id: 2,
		title: "All-Day Project Sprint",
		startTime: "00:00",
		endTime: "23:59",
		date: "2025-02-07",
		color: "bg-red-100 text-red-900",
	},
	{
		id: 3,
		title: "International Client Call",
		startTime: "03:00",
		endTime: "04:00",
		date: "2025-02-09",
		color: "bg-green-100 text-green-900",
	},
	{
		id: 4,
		title: "Workshop A",
		startTime: "14:00",
		endTime: "16:00",
		date: "2025-02-10",
		color: "bg-purple-100 text-purple-900",
	},
];

export default function EventCalendar() {
	const [isAddEventOpen, setIsAddEventOpen] = useState(false);
	const [date, setDate] = useState(new Date(2025, 1, 1));
	const [view, setView] = useState("month");
	const [is24Hour, setIs24Hour] = useState(true);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

	const formatTime = (time: string) => {
		if (is24Hour) return time;
		const [hours, minutes] = time.split(":");
		const hour = Number.parseInt(hours);
		return `${hour % 12 || 12}:${minutes}${hour >= 12 ? "PM" : "AM"}`;
	};

	const handlePrevious = () => {
		switch (view) {
			case "day":
				setDate(addDays(date, -1));
				break;
			case "week":
				setDate(addDays(date, -7));
				break;
			case "month":
				setDate(addMonths(date, -1));
				break;
			case "year":
				setDate(addYears(date, -1));
				break;
		}
	};

	const handleNext = () => {
		switch (view) {
			case "day":
				setDate(addDays(date, 1));
				break;
			case "week":
				setDate(addDays(date, 7));
				break;
			case "month":
				setDate(addMonths(date, 1));
				break;
			case "year":
				setDate(addYears(date, 1));
				break;
		}
	};

	return (
		<div className="bg-background">
			<div className=" space-y-6">
				<div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={handlePrevious}>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{view === "day" && (
							<Select
								value={date.getDate().toString()}
								onValueChange={(value) => {
									const newDate = new Date(date);
									newDate.setDate(Number.parseInt(value));
									setDate(newDate);
								}}
							>
								<SelectTrigger className="min-w-[120px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
										<SelectItem key={day} value={day.toString()}>
											{format(
												new Date(date.getFullYear(), date.getMonth(), day),
												"MMMM d",
											)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}

						{view === "week" && (
							<Select
								value={startOfWeek(date).getDate().toString()}
								onValueChange={(value) => {
									const newDate = new Date(date);
									newDate.setDate(Number.parseInt(value));
									setDate(newDate);
								}}
							>
								<SelectTrigger className="min-w-[120px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 5 }, (_, i) => {
										const weekStart = startOfWeek(
											new Date(date.getFullYear(), date.getMonth(), 1 + i * 7),
										);
										return (
											<SelectItem
												key={i}
												value={weekStart.getDate().toString()}
											>
												{`Week ${i + 1}`}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						)}

						{(view === "month" || view === "year") && (
							<>
								<Select
									value={months[date.getMonth()]}
									onValueChange={(value) => {
										const newDate = new Date(date);
										newDate.setMonth(months.indexOf(value));
										setDate(newDate);
									}}
								>
									<SelectTrigger className="min-w-[120px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{months.map((month) => (
											<SelectItem key={month} value={month}>
												{month}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={date.getFullYear().toString()}
									onValueChange={(value) => {
										const newDate = new Date(date);
										newDate.setFullYear(Number.parseInt(value));
										setDate(newDate);
									}}
								>
									<SelectTrigger className="w-[100px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{years.map((year) => (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</>
						)}

						<Button variant="ghost" size="icon" onClick={handleNext}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setIs24Hour(!is24Hour)}
							className="w-[70px]"
						>
							<Clock className="mr-1 h-4 w-4" />
							<span className="text-xs">{is24Hour ? "24h" : "12h"}</span>
						</Button>

						<Button variant="outline" size="icon">
							<Filter className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="mx-2 h-6" />

						<Button
							variant={view === "day" ? "secondary" : "outline"}
							size="icon"
							onClick={() => setView("day")}
						>
							<LayoutList className="h-4 w-4" />
						</Button>
						<Button
							variant={view === "week" ? "secondary" : "outline"}
							size="icon"
							onClick={() => setView("week")}
						>
							<LayoutGrid className="h-4 w-4" />
						</Button>
						<Button
							variant={view === "month" ? "secondary" : "outline"}
							size="icon"
							onClick={() => setView("month")}
						>
							<Grid2X2 className="h-4 w-4" />
						</Button>
						<Button
							variant={view === "year" ? "secondary" : "outline"}
							size="icon"
							onClick={() => setView("year")}
						>
							<CalendarIcon className="h-4 w-4" />
						</Button>

						<Button onClick={() => setIsAddEventOpen(true)} disabled>
							<Plus className="mr-2 h-4 w-4" /> Add Event
						</Button>
					</div>
				</div>

				<div className="rounded-lg border bg-card">
					{view === "month" && (
						<>
							<div className="grid grid-cols-7 gap-px border-b bg-muted">
								{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
									(day) => (
										<div
											key={day}
											className="bg-background p-3 text-center font-medium text-sm"
										>
											{day}
										</div>
									),
								)}
							</div>
							<div className="grid grid-cols-7 gap-px bg-muted">
								{(() => {
									const monthStart = startOfMonth(date);
									const daysInMonth = getDaysInMonth(date);
									const startDay = getDay(monthStart);
									// Adjust for Monday start (0 = Monday, 6 = Sunday)
									const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

									return Array.from({ length: daysInMonth }).map((_, index) => {
										const currentDate = addDays(monthStart, index);
										const dateStr = format(currentDate, "yyyy-MM-dd");
										const dayEvents = events.filter(
											(event) => event.date === dateStr,
										);
										// const dayOfWeek = getDay(currentDate);
										// Calculate the grid position
										// const gridIndex = index + adjustedStartDay;

										return (
											<div
												key={index}
												style={{
													gridColumn:
														index === 0 ? adjustedStartDay + 1 : undefined,
												}}
												className="min-h-[150px] border border-border bg-background p-2"
											>
												<div className="font-medium text-sm">
													{format(currentDate, "d")}
												</div>
												<div className="mt-1 space-y-1">
													{dayEvents.map((event) => (
														<div
															key={event.id}
															className={cn(
																"rounded px-2 py-1 text-xs",
																event.color,
															)}
														>
															{event.title}
															<div className="text-[10px]">
																{formatTime(event.startTime)} -{" "}
																{formatTime(event.endTime)}
															</div>
														</div>
													))}
												</div>
											</div>
										);
									});
								})()}
							</div>
						</>
					)}

					{view === "week" && (
						<div className="grid grid-cols-7 gap-px bg-muted">
							{Array.from({ length: 7 }).map((_, i) => {
								const currentDate = addDays(date, i);
								const dateStr = format(currentDate, "yyyy-MM-dd");
								const dayEvents = events.filter(
									(event) => event.date === dateStr,
								);

								return (
									<div key={i} className="min-h-screen bg-background p-4">
										<div className="mb-4 font-medium text-sm">
											{format(currentDate, "EEE, MMM d")}
										</div>
										<div className="space-y-2">
											{dayEvents.map((event) => (
												<div
													key={event.id}
													className={cn("rounded-lg p-3", event.color)}
												>
													<div className="font-medium">{event.title}</div>
													<div className="text-xs">
														{formatTime(event.startTime)} -{" "}
														{formatTime(event.endTime)}
													</div>
												</div>
											))}
										</div>
									</div>
								);
							})}
						</div>
					)}

					{view === "day" && (
						<div className="min-h-screen bg-background p-4">
							<div className="mb-4 font-medium text-lg">
								{format(date, "EEEE, MMMM d, yyyy")}
							</div>
							<div className="space-y-4">
								{Array.from({ length: 24 }).map((_, i) => {
									const hour = i.toString().padStart(2, "0");
									// const timeStr = `${hour}:00`;
									const dayEvents = events.filter(
										(event) =>
											event.date === format(date, "yyyy-MM-dd") &&
											event.startTime.startsWith(hour),
									);

									return (
										<div key={i} className="flex gap-4">
											<div className="w-20 text-muted-foreground text-sm">
												{formatTime(`${hour}:00`)}
											</div>
											<div className="min-h-[4rem] flex-1 border-t">
												{dayEvents.map((event) => (
													<div
														key={event.id}
														className={cn("mt-1 rounded-lg p-2", event.color)}
													>
														<div className="font-medium">{event.title}</div>
														<div className="text-xs">
															{formatTime(event.startTime)} -{" "}
															{formatTime(event.endTime)}
														</div>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{view === "year" && (
						<div className="grid grid-cols-4 gap-4 p-4">
							{months.map((month, i) => (
								<div key={month} className="rounded-lg border p-4">
									<div className="mb-2 font-medium">{month}</div>
									<div className="grid grid-cols-7 gap-1">
										{["M", "T", "W", "T", "F", "S", "S"].map((day) => (
											<div
												key={day}
												className="text-center text-muted-foreground text-xs"
											>
												{day}
											</div>
										))}
										{Array.from({ length: 31 }).map((_, day) => {
											const currentDate = new Date(
												date.getFullYear(),
												i,
												day + 1,
											);
											if (currentDate.getMonth() !== i) return null;
											const dateStr = format(currentDate, "yyyy-MM-dd");
											const hasEvent = events.find((e) => e.date === dateStr);
											const colors: Record<number, string> = {
												0: "bg-blue-100",
												1: "bg-pink-100",
												2: "bg-green-100",
												3: "bg-yellow-100",
												4: "bg-purple-100",
											};
											return (
												<div
													key={day}
													className="relative flex items-center justify-center"
												>
													<div
														className={cn(
															"flex h-8 w-8 items-center justify-center rounded-full text-xs",
															hasEvent ? colors[day % 5] : "hover:bg-muted",
														)}
													>
														{day + 1}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<AddEventDialog
				open={isAddEventOpen}
				onOpenChange={setIsAddEventOpen}
				is24Hour={is24Hour}
			/>
		</div>
	);
}

function AddEventDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	is24Hour: boolean;
}) {
	// const formatTimeOption = (hour: number) => {
	// 	if (is24Hour) return `${hour.toString().padStart(2, "0")}:00`;
	// 	return `${hour % 12 || 12}:00${hour >= 12 ? "PM" : "AM"}`;
	// };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<CalendarIcon className="h-5 w-5" />
						<DialogTitle>Add Event</DialogTitle>
					</div>
					<p className="text-muted-foreground text-sm">
						Create a new event in your calendar.
					</p>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="title">Event Title</Label>
						<Input id="title" placeholder="Event Title" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea id="description" placeholder="Description" />
					</div>
					<div className="flex gap-2 overflow-x-auto py-1">
						{[
							"All Day",
							"Early Morning",
							"Morning",
							"Afternoon",
							"Evening",
						].map((time) => (
							<Button key={time} variant="outline" className="shrink-0">
								{time}
							</Button>
						))}
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										February 24th, 2025
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" initialFocus />
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>Start Time</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="09:00" />
								</SelectTrigger>
								<SelectContent>
									<ScrollArea className="h-[200px]">
										{Array.from({ length: 24 }).map((_, i) => (
											<SelectItem
												key={i}
												value={`${i.toString().padStart(2, "0")}:00`}
											>
												{`${i.toString().padStart(2, "0")}:00`}
											</SelectItem>
										))}
									</ScrollArea>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>End Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										February 24th, 2025
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" initialFocus />
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>End Time</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="10:00" />
								</SelectTrigger>
								<SelectContent>
									<ScrollArea className="h-[200px]">
										{Array.from({ length: 24 }).map((_, i) => (
											<SelectItem
												key={i}
												value={`${i.toString().padStart(2, "0")}:00`}
											>
												{`${i.toString().padStart(2, "0")}:00`}
											</SelectItem>
										))}
									</ScrollArea>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Event Color</Label>
						<Select defaultValue="blue">
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="blue">Blue</SelectItem>
								<SelectItem value="red">Red</SelectItem>
								<SelectItem value="green">Green</SelectItem>
								<SelectItem value="yellow">Yellow</SelectItem>
								<SelectItem value="purple">Purple</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => onOpenChange(false)}>Save</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

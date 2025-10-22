/**
 * MyEventCalendar Component
 *
 * A calendar component wrapper that demonstrates the integration of EventCalendar
 * with useEventCalendar hook for state and data management.
 *
 * Core Features:
 * 1. Calendar Configuration
 *    - Default month view display
 *    - 24-hour time format
 *    - Double-click interactions for view switching
 *    - Detailed month view rendering
 *    - More properties in EventCalendarConfigType
 *
 * 2. Event Data Management (via useEventCalendar)
 *    - Event state management
 *    - CRUD operations with optimistic updates
 *    - Loading states
 *    - Error handling with retry options
 *
 * 3. Mock API Integration
 *    - Simulated network latency
 *    - Event CRUD operations
 *    - Date range-based event fetching
 *    - Simply replace to real API
 *
 * Usage:
 * ```tsx
 * <MyEventCalendar />
 * ```
 *
 * Note: Replace mock API handlers with actual API implementations for production use
 * while maintaining the same interface structure.
 */
"use client";

import { createScheduledCompositions } from "@/lib/actions/scheduled_composition/createScheduledComposition";
import { deleteScheduledCompositions } from "@/lib/actions/scheduled_composition/deleteScheduledComposition";
import { fetchScheduledCompositions } from "@/lib/actions/scheduled_composition/fetchScheduledCompositions";
import { updateScheduledCompositions } from "@/lib/actions/scheduled_composition/updateScheduledComposition";
import { fromCalendarEventToForm, mapToCalendarEvents } from "@/lib/utils";
import EventCalendar from "./event-calendar/EventCalendar";
import {
	type EventCalendarHookConfig,
	useEventCalendar,
} from "./event-calendar/hooks/useEventCalendar";
import type {
	CalendarEventType,
	EventCalendarConfigType,
} from "./event-calendar/types";

// import { enUS } from "./event-calendar/locales/en";

type MyEventCalendarProps = {
	initialEvents: CalendarEventType[];
};

const OPTIONAL_CALENDAR_CONFIG: EventCalendarConfigType = {
	//localization: enUS
	defaultView: "month",
	use24HourFormatByDefault: true,
	dayView: {
		enableDoubleClickToAddEvent: false,
		viewType: "resource",
	},
	weekView: {
		enableDoubleClickToShiftViewToDaily: false,
		viewType: "resource",
	},
	monthView: {
		enableDoubleClickToShiftViewToWeekly: false,
		viewType: "basic",
		showOnlyCurrentMonth: true,
	},
	yearView: {
		enableDoubleClickToShiftViewToMonthly: false,
	},
} as const;

const OPTIONAL_HOOK_CONFIG: EventCalendarHookConfig = {
	events: {
		allowUserRetryAfterFailure: true,
	},
} as const;

const MyEventCalendar = ({ initialEvents }: MyEventCalendarProps) => {
	const handleEventAdd = async (
		event: Omit<CalendarEventType, "id">,
	): Promise<CalendarEventType> => {
		try {
			const payload = fromCalendarEventToForm(event);
			console.log("Creating scheduled composition with payload:", payload);
			const response = await createScheduledCompositions(payload);

			if (!response.success || !response.data) {
				throw new Error(response.errorMessage ?? "Failed to create event");
			}

			return mapToCalendarEvents([response.data])[0];
		} catch (err) {
			console.error("Error in handleEventAdd:", err);
			throw err;
		}
	};

	const handleEventUpdate = async (
		event: CalendarEventType,
	): Promise<CalendarEventType> => {
		const payload = fromCalendarEventToForm(event);
		const response = await updateScheduledCompositions(
			Number(event.id),
			payload,
		);
		if (!response.success || !response.data) {
			throw new Error(response.errorMessage ?? "Failed to update event");
		}
		return mapToCalendarEvents([response.data])[0];
	};

	const handleEventDelete = async (eventId: string): Promise<void> => {
		const response = await deleteScheduledCompositions(Number(eventId));
		if (!response.success) {
			throw new Error(response.errorMessage ?? "Failed to delete event");
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDateRangeChange = async (
		start: Date,
		end: Date,
		_signal?: AbortSignal,
	): Promise<CalendarEventType[]> => {
		console.log("[handleDateRangeChange]", {
			start: start.toISOString(),
			end: end.toISOString(),
		});

		try {
			const response = await fetchScheduledCompositions(
				start.toISOString(),
				end.toISOString(),
			);

			if (!response.success || !response.data) {
				throw new Error(
					response.errorMessage ?? "Failed to fetch scheduled compositions",
				);
			}

			const mapped = mapToCalendarEvents(response.data);
			return mapped;
		} catch (err) {
			console.error("[handleDateRangeChange] error:", err);
			return [];
		}
	};

	const {
		events,
		isLoading,
		addEvent,
		updateEvent,
		deleteEvent,
		onViewOrDateChange,
	} = useEventCalendar({
		config: OPTIONAL_HOOK_CONFIG,
		initialEvents,
		onEventAdd: handleEventAdd,
		onEventUpdate: handleEventUpdate,
		onEventDelete: handleEventDelete,
		onDateRangeChange: handleDateRangeChange,
	});
	return (
		<EventCalendar
			config={OPTIONAL_CALENDAR_CONFIG}
			events={events}
			isLoading={isLoading}
			onEventAdd={addEvent}
			onEventUpdate={updateEvent}
			onEventDelete={deleteEvent}
			onDateRangeChange={onViewOrDateChange}
		/>
	);
};

export default MyEventCalendar;

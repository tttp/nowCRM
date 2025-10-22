import type { CalendarEventType } from "@/components/event-calendar/types";
import MyEventCalendar from "@/components/MyEventCalendar";
import { fetchScheduledCompositions } from "@/lib/actions/scheduled_composition/fetchScheduledCompositions";
import { mapToCalendarEvents } from "@/lib/utils";

export default async function CalendarPage() {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	const res = await fetchScheduledCompositions(
		start.toISOString(),
		end.toISOString(),
	);
	const initialEvents: CalendarEventType[] =
		res.success && res.data ? mapToCalendarEvents(res.data) : [];
	return (
		<div className="p-4">
			<div className="mx-auto w-full max-w-7xl">
				<MyEventCalendar initialEvents={initialEvents} />
			</div>
		</div>
	);
}
